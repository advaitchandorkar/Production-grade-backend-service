import { useEffect, useMemo, useState } from "react";

import { createOrder, fetchOrders } from "../api.js";
import Loading from "../components/Loading.jsx";

export default function Orders({ token, pushToast }) {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ item_name: "", quantity: 1 });
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrders(token);
      setOrders(data);
    } catch (err) {
      pushToast?.({
        type: "error",
        title: "Orders unavailable",
        message: err.message || "Try again shortly."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newOrder = await createOrder(form, token);
      setOrders([newOrder, ...orders]);
      setForm({ item_name: "", quantity: 1 });
      pushToast?.({
        type: "success",
        title: "Order created",
        message: `${newOrder.item_name} queued.`
      });
    } catch (err) {
      pushToast?.({
        type: "error",
        title: "Order failed",
        message: err.message || "Check the details and retry."
      });
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders]
  );

  if (!token) {
    return (
      <section className="page">
        <h1>Orders</h1>
        <p className="notice">Please log in to view orders.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header split">
        <div>
          <h1>Orders</h1>
          <p>Create orders and keep a clear fulfillment pulse.</p>
        </div>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-label">Orders</span>
            <strong>{totalOrders}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending</span>
            <strong>{pendingOrders}</strong>
          </div>
        </div>
      </div>

      <div className="grid two-col">
        <form className="card elevated" onSubmit={handleSubmit}>
          <h2>Create order</h2>
          <label>
            Item name
            <input
              type="text"
              value={form.item_name}
              onChange={(event) => setForm({ ...form, item_name: event.target.value })}
              required
            />
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(event) =>
                setForm({ ...form, quantity: Number(event.target.value) })
              }
              required
            />
          </label>
          <button className="btn" type="submit">
            Create order
          </button>
        </form>

        <div className="card elevated scroll-card">
          <div className="list-header">
            <h2>Latest orders</h2>
            {isLoading ? <span className="muted">Syncing...</span> : null}
          </div>
          {isLoading ? <Loading label="Syncing orders" full={false} /> : null}
          <div className="list compact scroll-body">
            {orders.map((order) => (
              <div key={order.id} className="list-row">
                <div>
                  <strong>{order.item_name}</strong>
                  <p className="muted">
                    Created: {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="pill">{order.status}</span>
                <span className="pill">Qty: {order.quantity}</span>
              </div>
            ))}
            {orders.length === 0 && !isLoading ? (
              <div className="empty-state">
                <h3>No orders yet</h3>
                <p className="muted">Create your first order to begin tracking flow.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

    </section>
  );
}

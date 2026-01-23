import { useEffect, useState } from "react";

import { createOrder, fetchOrders } from "../api.js";

export default function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ item_name: "", quantity: 1 });
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const data = await fetchOrders(token);
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const newOrder = await createOrder(form, token);
      setOrders([newOrder, ...orders]);
      setForm({ item_name: "", quantity: 1 });
    } catch (err) {
      setError(err.message || "Failed to create order");
    }
  };

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
      <div className="page-header">
        <h1>Orders</h1>
        <p>Create orders and keep an eye on fulfillment.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
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

      <div className="list">
        {orders.map((order) => (
          <div key={order.id} className="list-row">
            <div>
              <strong>{order.item_name}</strong>
              <p className="muted">Created: {new Date(order.created_at).toLocaleString()}</p>
            </div>
            <span className="pill">{order.status}</span>
            <span className="pill">Qty: {order.quantity}</span>
          </div>
        ))}
        {orders.length === 0 ? <p className="muted">No orders yet.</p> : null}
      </div>

      {error ? <p className="notice error">{error}</p> : null}
    </section>
  );
}

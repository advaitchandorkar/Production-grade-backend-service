import { useEffect, useMemo, useState } from "react";

import { createInventoryItem, fetchInventory } from "../api.js";
import Loading from "../components/Loading.jsx";

export default function Inventory({ token, pushToast }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventory(token);
      setItems(data);
    } catch (err) {
      pushToast?.({
        type: "error",
        title: "Inventory unavailable",
        message: err.message || "Try again in a moment."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadItems();
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newItem = await createInventoryItem(form, token);
      setItems([newItem, ...items]);
      setForm({ name: "", quantity: 0 });
      pushToast?.({
        type: "success",
        title: "Inventory updated",
        message: `${newItem.name} added.`
      });
    } catch (err) {
      pushToast?.({
        type: "error",
        title: "Item not added",
        message: err.message || "Check the form fields."
      });
    }
  };

  const totalSkus = items.length;
  const totalUnits = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [items]
  );

  if (!token) {
    return (
      <section className="page">
        <h1>Inventory</h1>
        <p className="notice">Please log in to view inventory.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header split">
        <div>
          <h1>Inventory</h1>
          <p>Track stock levels, add new SKUs, and keep ops aligned.</p>
        </div>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-label">SKUs</span>
            <strong>{totalSkus}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total units</span>
            <strong>{totalUnits}</strong>
          </div>
        </div>
      </div>

      <div className="grid two-col">
        <form className="card elevated" onSubmit={handleSubmit}>
          <h2>Add item</h2>
          <label>
            Item name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={(event) =>
                setForm({ ...form, quantity: Number(event.target.value) })
              }
              required
            />
          </label>
          <button className="btn" type="submit">
            Add item
          </button>
        </form>

        <div className="card elevated scroll-card">
          <div className="list-header">
            <h2>Latest items</h2>
            {isLoading ? <span className="muted">Syncing...</span> : null}
          </div>
          {isLoading ? (
            <Loading label="Syncing inventory" full={false} />
          ) : null}
          <div className="list compact scroll-body">
            {items.map((item) => (
              <div key={item.id} className="list-row">
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">
                    Created: {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="pill">Qty: {item.quantity}</span>
              </div>
            ))}
            {items.length === 0 && !isLoading ? (
              <div className="empty-state">
                <h3>No inventory yet</h3>
                <p className="muted">Add your first item to start tracking stock.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

    </section>
  );
}

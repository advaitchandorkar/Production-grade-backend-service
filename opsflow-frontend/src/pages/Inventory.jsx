import { useEffect, useState } from "react";

import { createInventoryItem, fetchInventory } from "../api.js";

export default function Inventory({ token }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: 0 });
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const data = await fetchInventory(token);
      setItems(data);
    } catch (err) {
      setError(err.message || "Failed to load inventory");
    }
  };

  useEffect(() => {
    if (token) {
      loadItems();
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const newItem = await createInventoryItem(form, token);
      setItems([newItem, ...items]);
      setForm({ name: "", quantity: 0 });
    } catch (err) {
      setError(err.message || "Failed to add item");
    }
  };

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
      <div className="page-header">
        <h1>Inventory</h1>
        <p>Track stock levels and add new items.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
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

      <div className="list">
        {items.map((item) => (
          <div key={item.id} className="list-row">
            <div>
              <strong>{item.name}</strong>
              <p className="muted">Created: {new Date(item.created_at).toLocaleString()}</p>
            </div>
            <span className="pill">Qty: {item.quantity}</span>
          </div>
        ))}
        {items.length === 0 ? <p className="muted">No inventory yet.</p> : null}
      </div>

      {error ? <p className="notice error">{error}</p> : null}
    </section>
  );
}

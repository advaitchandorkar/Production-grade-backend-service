import { NavLink } from "react-router-dom";

export default function Nav({ token, onLogout }) {
  return (
    <header className="nav">
      <div className="logo">OpsFlow</div>
      <nav>
        <NavLink to="/" end>
          Login/Register
        </NavLink>
        <NavLink to="/inventory">Inventory</NavLink>
        <NavLink to="/orders">Orders</NavLink>
      </nav>
      <div className="nav-actions">
        {token ? (
          <button type="button" onClick={onLogout} className="btn secondary">
            Logout
          </button>
        ) : (
          <span className="badge">Not signed in</span>
        )}
      </div>
    </header>
  );
}

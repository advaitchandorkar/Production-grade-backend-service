import { NavLink } from "react-router-dom";

export default function Nav({ token, email, onLogout }) {
  return (
    <header className="nav">
      <div className="logo">
        <span className="logo-mark" aria-hidden="true">
          OF
        </span>
        <div>
          <div className="logo-title">OpsFlow</div>
          <div className="logo-subtitle">Command center</div>
        </div>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end>
          Access
        </NavLink>
        <NavLink to="/inventory">Inventory</NavLink>
        <NavLink to="/orders">Orders</NavLink>
      </nav>
      <div className="nav-actions">
        {token ? (
          <>
            <span className="status online">{email || "Signed in"}</span>
            <button type="button" onClick={onLogout} className="btn secondary">
              Logout
            </button>
          </>
        ) : (
          <span className="status offline">Sign in to continue</span>
        )}
      </div>
    </header>
  );
}

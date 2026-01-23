import { useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Nav from "./components/Nav.jsx";
import Inventory from "./pages/Inventory.jsx";
import Login from "./pages/Login.jsx";
import Orders from "./pages/Orders.jsx";

const TOKEN_KEY = "opsflow_token";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");

  const handleAuth = (newToken) => {
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem(TOKEN_KEY);
  };

  const authProps = useMemo(() => ({ token }), [token]);

  return (
    <div className="app">
      <Nav token={token} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Login onAuth={handleAuth} />} />
          <Route path="/inventory" element={<Inventory {...authProps} />} />
          <Route path="/orders" element={<Orders {...authProps} />} />
        </Routes>
      </main>
    </div>
  );
}

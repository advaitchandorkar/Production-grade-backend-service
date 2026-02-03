import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Nav from "./components/Nav.jsx";
import Loading from "./components/Loading.jsx";
import ToastStack from "./components/ToastStack.jsx";
import useToasts from "./hooks/useToasts.js";
import { fetchMe } from "./api.js";

const Inventory = lazy(() => import("./pages/Inventory.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));

const TOKEN_KEY = "opsflow_token";
const EMAIL_KEY = "opsflow_email";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [email, setEmail] = useState(() => localStorage.getItem(EMAIL_KEY) || "");
  const { toasts, push, remove } = useToasts();

  const handleAuth = (newToken) => {
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    push({ type: "success", title: "Authenticated", message: "Session active." });
  };

  const handleLogout = () => {
    setToken("");
    setEmail("");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    push({ type: "info", title: "Signed out", message: "You are now a guest." });
  };

  const authProps = useMemo(
    () => ({ token, pushToast: push }),
    [token, push]
  );

  useEffect(() => {
    if (!token) return;
    if (email) return;
    fetchMe(token)
      .then((data) => {
        if (data?.email) {
          setEmail(data.email);
          localStorage.setItem(EMAIL_KEY, data.email);
        }
      })
      .catch(() => {
        handleLogout();
      });
  }, [token, email]);

  return (
    <div className="app">
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <Nav token={token} email={email} onLogout={handleLogout} />
      <ToastStack toasts={toasts} onClose={remove} />
      <main className="main">
        <Suspense fallback={<Loading label="Loading experience" />}>
          <Routes>
            <Route
              path="/"
              element={<Login onAuth={handleAuth} pushToast={push} />}
            />
            <Route path="/inventory" element={<Inventory {...authProps} />} />
            <Route path="/orders" element={<Orders {...authProps} />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="footer">
        <span>OpsFlow · Inventory & Order Intelligence</span>
        <span className="muted">© 2026 Advait</span>
      </footer>
    </div>
  );
}

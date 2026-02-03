import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser, registerUser } from "../api.js";

export default function Login({ onAuth, pushToast }) {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await registerUser(registerData);
      const tokenResponse = await loginUser(registerData);
      onAuth(tokenResponse.access_token);
      pushToast?.({
        type: "success",
        title: "Welcome to OpsFlow",
        message: "Your account is ready."
      });
      navigate("/inventory");
    } catch (err) {
      pushToast?.({
        type: "error",
        title: "Registration failed",
        message: err.message || "Try a different email."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const tokenResponse = await loginUser(loginData);
      onAuth(tokenResponse.access_token);
      pushToast?.({
        type: "success",
        title: "Welcome back",
        message: "You're signed in."
      });
      navigate("/inventory");
    } catch (err) {
      pushToast?.({
        type: "error",
        title: "Login failed",
        message: err.message || "Check your credentials."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Ops intelligence in one place</p>
          <h1>Coordinate inventory and orders with a live control plane.</h1>
          <p className="lead">
            OpsFlow keeps every team aligned with a fast, focused view of stock,
            orders, and actionables. Authenticate to start orchestrating.
          </p>
          <div className="hero-highlights">
            <div>
              <h3>Live inventory</h3>
              <p className="muted">Track stock movements without leaving the dashboard.</p>
            </div>
            <div>
              <h3>Order momentum</h3>
              <p className="muted">Create and monitor orders with clear status visibility.</p>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <h2>Get started fast</h2>
          <p className="muted">Use a real email to register. You'll be logged in instantly.</p>
          <div className="pill-group">
            <span className="pill ghost">JWT secure</span>
            <span className="pill ghost">Postgres ready</span>
            <span className="pill ghost">FastAPI docs</span>
          </div>
        </div>
      </div>

      <div className="grid">
        <form className="card elevated" onSubmit={handleRegister}>
          <h2>Create account</h2>
          <label>
            Email
            <input
              type="email"
              value={registerData.email}
              onChange={(event) =>
                setRegisterData({ ...registerData, email: event.target.value })
              }
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={registerData.password}
              onChange={(event) =>
                setRegisterData({ ...registerData, password: event.target.value })
              }
              required
            />
          </label>
          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Register"}
          </button>
        </form>

        <form className="card elevated" onSubmit={handleLogin}>
          <h2>Sign in</h2>
          <label>
            Email
            <input
              type="email"
              value={loginData.email}
              onChange={(event) =>
                setLoginData({ ...loginData, email: event.target.value })
              }
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={loginData.password}
              onChange={(event) =>
                setLoginData({ ...loginData, password: event.target.value })
              }
              required
            />
          </label>
          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>

    </section>
  );
}

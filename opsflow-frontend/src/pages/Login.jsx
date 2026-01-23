import { useState } from "react";

import { loginUser, registerUser } from "../api.js";

export default function Login({ onAuth }) {
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await registerUser(registerData);
      const tokenResponse = await loginUser(registerData);
      onAuth(tokenResponse.access_token);
      setMessage("Registered and logged in.");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const tokenResponse = await loginUser(loginData);
      onAuth(tokenResponse.access_token);
      setMessage("Logged in.");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1>Welcome to OpsFlow</h1>
        <p>Sign in to manage inventory and orders.</p>
      </div>

      <div className="grid">
        <form className="card" onSubmit={handleRegister}>
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
          <button className="btn" type="submit">
            Register
          </button>
        </form>

        <form className="card" onSubmit={handleLogin}>
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
          <button className="btn" type="submit">
            Login
          </button>
        </form>
      </div>

      {message ? <p className="notice success">{message}</p> : null}
      {error ? <p className="notice error">{error}</p> : null}
    </section>
  );
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function registerUser(payload) {
  return request("/auth/register", { method: "POST", body: payload });
}

export async function loginUser(payload) {
  return request("/auth/login", { method: "POST", body: payload });
}

export async function fetchInventory(token) {
  return request("/inventory", { token });
}

export async function createInventoryItem(payload, token) {
  return request("/inventory", { method: "POST", body: payload, token });
}

export async function fetchOrders(token) {
  return request("/orders", { token });
}

export async function createOrder(payload, token) {
  return request("/orders", { method: "POST", body: payload, token });
}

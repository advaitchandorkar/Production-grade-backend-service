const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const DEFAULT_TIMEOUT_MS = 10000;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      method: options.method || "GET",
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });

    if (!response.ok) {
      const message = await parseError(response);
      throw new Error(message || "Request failed");
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function parseError(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json();
    return data.detail || data.message || JSON.stringify(data);
  }
  return response.text();
}

export async function registerUser(payload) {
  return request("/auth/register", { method: "POST", body: payload });
}

export async function loginUser(payload) {
  return request("/auth/login", { method: "POST", body: payload });
}

export async function fetchMe(token) {
  return request("/auth/me", { token });
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

const API_BASE = "/api";

function getHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ── Auth Endpoints ──

export async function registerUser(username, password) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

// ── User Endpoints ──

export async function createNamespace(namespace) {
  const response = await fetch(`${API_BASE}/devplatform/namespace`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ namespace }),
  });
  return response.json();
}

export async function createApplication(data) {
  const response = await fetch(`${API_BASE}/argocd/application`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function getMyRequests() {
  const response = await fetch(`${API_BASE}/devplatform/my-requests`, {
    headers: getHeaders(),
  });
  return response.json();
}

// ── Admin Endpoints ──

export async function getRequests(status = null) {
  const params = status ? `?status=${status}` : "";
  const response = await fetch(`${API_BASE}/admin/requests${params}`, {
    headers: getHeaders(),
  });
  return response.json();
}

export async function getRequest(id) {
  const response = await fetch(`${API_BASE}/admin/requests/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
}

export async function approveRequest(id) {
  const response = await fetch(`${API_BASE}/admin/approve/${id}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return response.json();
}

export async function rejectRequest(id) {
  const response = await fetch(`${API_BASE}/admin/reject/${id}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return response.json();
}

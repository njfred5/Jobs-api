// Small fetch wrapper: adds the JWT, parses JSON, throws readable errors.
const TOKEN_KEY = "jobs_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(path, { method = "GET", body, signal } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { method, headers, signal, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  jobs: (params, signal) => request(`/jobs?${new URLSearchParams(params)}`, { signal }),
  filters: () => request("/jobs/filters"),
  register: (body) => request("/auth/register", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),
  me: () => request("/auth/me"),
  saved: () => request("/saved"),
  saveJob: (job) => request("/saved", { method: "POST", body: job }),
  unsaveJob: (id) => request(`/saved/${encodeURIComponent(id)}`, { method: "DELETE" })
};

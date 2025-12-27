import { api } from "./auth-service.js";

export async function getAuthState() {
  return api("/api/auth/me").then(r => r.json());
}

export async function logout() {
  await api("/api/auth/logout", { method: "POST" });
  location.href = "/index.html";
}

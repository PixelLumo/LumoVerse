import { getAuthState, logout } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const auth = await getAuthState();

  const guest = document.getElementById("guest-links");
  const user = document.getElementById("user-links");

  if (auth.loggedIn) {
    guest.style.display = "none";
    user.style.display = "inline";
    document.getElementById("logoutBtn").onclick = logout;
  } else {
    guest.style.display = "inline";
    user.style.display = "none";
  }
});

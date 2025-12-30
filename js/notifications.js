const STORAGE_KEY = "pixellumo_notifications";

export function getNotifications() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function addNotification(message) {
  const notifications = getNotifications();
  notifications.unshift({
    message,
    time: new Date().toISOString(),
    read: false
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  updateBadge();
}

export function markAllRead() {
  const notifications = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  updateBadge();
}

export function updateBadge() {
  const unread = getNotifications().filter(n => !n.read).length;
  const badge = document.getElementById("notif-badge");
  if (badge) badge.textContent = unread || "";
}

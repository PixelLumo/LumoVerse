export async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = await fetch(file).then(r => r.text());
}

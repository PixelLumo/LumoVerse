async function loadLayout() {
  const [header, nav, footer] = await Promise.all([
    fetch("js/header.html").then(r => r.text()),
    fetch("js/nav.html").then(r => r.text()),
    fetch("js/footer.html").then(r => r.text())
  ]);

  document.getElementById("header-placeholder").innerHTML = header;
  document.getElementById("nav-placeholder").innerHTML = nav;
  document.getElementById("footer-placeholder").innerHTML = footer;
  document.body.classList.remove("loading");
}

loadLayout();

function load(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
}

load("header", "components/header.html");
load("nav", "components/nav.html");
load("footer", "components/footer.html");

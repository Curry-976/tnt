(function () {
  "use strict";

  var body = document.body;

  function currentTheme() {
    return body.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-dark][data-light]").forEach(function (node) {
      var text = theme === "light" ? node.getAttribute("data-light") : node.getAttribute("data-dark");
      if (text) node.textContent = text;
    });
    try {
      localStorage.setItem("tnt-theme", theme);
    } catch (e) {}
  }

  var saved = null;
  try {
    saved = localStorage.getItem("tnt-theme");
  } catch (e) {}
  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else {
    applyTheme(currentTheme());
  }

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  });
})();

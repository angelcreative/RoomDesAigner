document.addEventListener("DOMContentLoaded", function() {
  const loadingSvg = document.getElementById("loadingSvg");
  loadingSvg.style.display = "block";
});

window.addEventListener("load", function() {
  const loadingSvg = document.getElementById("loadingSvg");
  loadingSvg.style.display = "none";
});

window.addEventListener("load", function () {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 1800);
});

function openLogin() {
    document.getElementById("loginsu").style.display = "flex";
}
function closeLogin() {
    document.getElementById("loginsu").style.display = "none";
}
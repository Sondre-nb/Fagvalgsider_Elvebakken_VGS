window.addEventListener("scroll", function () {
    let header = document.getElementById("knapp");
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollBunn = window.innerHeight / 2
    header.style.opacity = 1 - scrollTop / scrollBunn;
});

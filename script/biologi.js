window.onresize = function() {
    let iframe = document.getElementById("memory-match-spill");
    let bunn = iframe.contentWindow.document.getElementById("nullstill-knapp").getBoundingClientRect().top;
    iframe.style.height = bunn + 70 + "px";
}

let iframe = document.getElementById("memory-match-spill");
let bunn = iframe.contentWindow.document.getElementById("nullstill-knapp").getBoundingClientRect().top;
iframe.style.height = bunn + 70 + "px";
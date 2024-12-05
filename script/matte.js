// Henter siden men kommer ifra fra local-storage og endrer tilbakeknappen slik at den går tilbake til den siden
window.addEventListener("DOMContentLoaded", function(){
    let side_man_kommer_ifra = String(localStorage.getItem("sideManKommerIfraLagring")).replace(/['"]+/g, ''); //.replace fjerner hermetegn
    console.log(side_man_kommer_ifra)
    tilbakeKnappEl = document.querySelector("#tilbake-knapp");
    tilbakeKnappEl.innerHTML = "&lt; Tilbake til " + side_man_kommer_ifra;
    tilbakeKnappEl.href = "/" + side_man_kommer_ifra + "/";
});
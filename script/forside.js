// Gradvis skjuler knappen ned fra statskjermen
window.addEventListener("scroll", function () {
    let header = document.getElementById("ned-knapp");
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollBunn = window.innerHeight / 2
    header.style.opacity = 1 - scrollTop / scrollBunn;
});

//henter info fra css-fil for å bruke det til utregning av hvor langt man skal bla og når knappen for å bla il høyre i menyen skal skjules
let fag_meny_info = document.querySelector('#fag_meny');
let fag_meny_info_computed_style = getComputedStyle(fag_meny_info);
let fag_i_meny_info = document.querySelectorAll('.fag_i_meny');
let fag_i_meny_info_computed_style = getComputedStyle(fag_i_meny_info[0]);
let total_bredde_meny_element = parseFloat(fag_meny_info_computed_style.gap) + parseFloat(fag_i_meny_info_computed_style.width);

// blar i menyen over fagvalgene
function flyttMeny(retning){
    let skjermbredde = document.documentElement.clientWidth;
    let fag_meny = document.getElementById("fag_meny");

    // regner ut hvor langt menyen skal bla om man trykker på knappene
    const blaLengde = skjermbredde - (skjermbredde % total_bredde_meny_element);

    if (retning == 'høyre'){
        // blar til høyre
        fag_meny.scrollBy({ left: blaLengde, behavior: 'smooth' });
    } else{
        // blar til venstre
        fag_meny.scrollBy({ left: -blaLengde, behavior: 'smooth' });
    }
}

// Henter knappene for å bla i menyen. Brukes når menyen scrolles og når man viser alle fagene i menyen under hverandre
let høyre_bla_knapp = document.getElementById("høyre_bla_knapp");
let venstre_bla_knapp = document.getElementById("venstre_bla_knapp");

//skjuler og viser knappene man bruker til å bla menyen
fag_meny.addEventListener("scroll", function(){
    let skjermbredde = window.innerWidth;

    //regner ut når pilen for å bla til venstre skal skjules
    if (fag_meny.scrollLeft == 0){
        venstre_bla_knapp.style.display = "none";
    } else{
        venstre_bla_knapp.style.display = "block";
    }
    //henter info om fag-meny-område for å bruke det til utregning om når pilen til høyre skal skjules
    let fag_meny_område_info = document.querySelector('#fag-meny-område');
    fag_meny_område_info_computed_style = getComputedStyle(fag_meny_område_info);
    //regner ut når pilen for å bla til høyre skal skjules
    if (fag_meny.scrollLeft + skjermbredde >= fag_meny.scrollWidth + 2*parseInt(fag_meny_område_info_computed_style.marginRight)){
        høyre_bla_knapp.style.display = "none";
    } else{
        høyre_bla_knapp.style.display = "block";
    }
})

let menyStatus = "rad"
// Finner ut når "vis-alle" blir klikket
let visAlleEl = document.querySelector('#vis-alle');
visAlleEl.addEventListener("click", toggleMeny);

// Henter variabelen antall_programfag
let antall_fag_i_menyen = getComputedStyle(document.documentElement).getPropertyValue('--antall_programfag');

// Endrer fra rad man kan bla i til alt under hverandre (og tilbake)
function toggleMeny(){
    fag_meny = document.getElementById("fag_meny");

    //Viser alle elementene i menyen
    if (menyStatus == "rad"){
        visAlleEl.innerHTML = "klapp sammen <";
        fag_meny.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
        menyStatus = "alle";
        høyre_bla_knapp.style.display = "none";
        venstre_bla_knapp.style.display = "none";
    } else{ // Legger elementene tilbake på en rad man kan bla
        visAlleEl.innerHTML = "vis alle >";
        fag_meny.style.gridTemplateColumns = "repeat(" + antall_fag_i_menyen + ", 1fr)";
        menyStatus = "rad";
        høyre_bla_knapp.style.display = "block";
    }
}

let mattefagene = document.querySelectorAll(".matte-fag");

document.addEventListener("DOMContentLoaded", function(){
    localStorage.setItem("sideManKommerIfraLagring", getComputedStyle(document.documentElement).getPropertyValue('--side_man_kommer_ifra'));
    console.log()
})

/* for (mattefag of mattefagene) {
    mattefag.onclick = function(){
        localStorage.setItem("sideManKommerIfraLagring", getComputedStyle(document.documentElement).getPropertyValue('--side_man_kommer_ifra'));
        console.log(getComputedStyle(document.documentElement).getPropertyValue('--side_man_kommer_ifra'))
    }
} */

//henter info fra css-fil for å bruke det til utregning av hvor langt man skal bla og når knappen for å bla il høyre i menyen skal skjules
let fag_meny_info = document.querySelector('#fag_meny');
fag_meny_info_computed_style = getComputedStyle(fag_meny_info);
let fag_i_meny_info = document.querySelectorAll('.fag_i_meny');
fag_i_meny_info_computed_style = getComputedStyle(fag_i_meny_info[0]);
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

//skjuler og viser knappene man bruker til å bla menyen
fag_meny.addEventListener("scroll", function(){
    let venstre_bla_knapp = document.getElementById("venstre_bla_knapp");
    let høyre_bla_knapp = document.getElementById("høyre_bla_knapp");
    let skjermbredde = document.documentElement.clientWidth;

    //regner ut når pilen for å bla til venstre skal skjules
    if (fag_meny.scrollLeft == 0){
        venstre_bla_knapp.style.display = "none";
    } else{
        venstre_bla_knapp.style.display = "block";
    }
    //regner ut når pilen for å bla til høyre skal skjules
    if (fag_meny.scrollLeft + skjermbredde >= fag_meny.scrollWidth + parseFloat(fag_meny_info_computed_style.padding)){
        høyre_bla_knapp.style.display = "none";
    } else{
        høyre_bla_knapp.style.display = "block";
    }
})

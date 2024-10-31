// blar i menyen over fagvalgene
function flyttMeny(retning){
    skjermbredde = document.documentElement.clientWidth;
    const fag_meny = document.getElementById("fag_meny");
    // regner ut hvor langt menyen skal bla om man trykker på knappene
    const blaLengde = skjermbredde - (skjermbredde % 200); // 200px er hvor mye plass hver lenke tar
    
    if (retning == 'høyre'){
        // blar til høyre
        fag_meny.scrollBy({ left: blaLengde, behavior: 'smooth' });
    } else{
        // blar til venstre
        fag_meny.scrollBy({ left: -blaLengde, behavior: 'smooth' });
    }
}

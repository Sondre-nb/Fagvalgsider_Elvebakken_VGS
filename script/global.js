// blar i menyen over fagvalgene
function flyttMeny(retning){
    skjermbredde = document.documentElement.clientWidth;
    let fag_meny = document.getElementById("fag_meny");
    let fag_meny_bredde = 2*15 + 16*200 // 2 ganger padding (15) + antall lenker(16) ganger plassen hver lenke tar (200)

    //henter variabel
    let r = document.querySelector(':root');
    let rs = getComputedStyle(r);
    let marginVenstre = rs.getPropertyValue('--margin_venstre_tall');

    // regner ut hvor langt menyen skal bla om man trykker på knappene
    let blaLengde = skjermbredde - (skjermbredde % 200); // 200px er hvor mye plass hver lenke tar
    
    if (retning == 'høyre'){
        //Endrer margin-left og blar til høyre
        marginVenstre -= blaLengde

        //Hindrer menyen i å bla for langt til høyre
        if (marginVenstre < -(fag_meny_bredde - skjermbredde)){
            marginVenstre = -(fag_meny_bredde - skjermbredde);
        }
    } else{
        //Endrer margin-left og blar til venstre
       marginVenstre -= -blaLengde;

        // hindrer menyen i å bla for langt til venstre 
        if (marginVenstre > 0){
            marginVenstre = 0;
        }
    }
    // Oppdaterer margin
    r.style.setProperty('--margin_venstre_tall', marginVenstre); 
    // overgangen tar 0,8 sek 
    fag_meny.style.transitionDuration = "0.8s";
}

function flyttMeny(retning){
    skjermbredde = document.documentElement.clientWidth;
    console.log('skjermbredde = ' + skjermbredde);
    let fag_meny = document.getElementById("fag_meny");
    /*variabel-ting*/
    let r = document.querySelector(':root');
    let rs = getComputedStyle(r);

    let blaLengde = skjermbredde - (skjermbredde % 200);
    console.log('blalengde = '+ blaLengde);
    console.log('margin_left = ' + fag_meny.style.marginLeft);
    if (retning == 'høyre'){
        console.log('høyre');
        /*Endrer margin-left og blar til høyre*/
        r.style.setProperty('--margin_venstre_tall', rs.getPropertyValue('--margin_venstre_tall') - blaLengde);
        
        /*Hindre menyen i å bla for langt til høyre*/
        console.log('fag_meny-bredde' + fag_meny.style.width);
        if (rs.getPropertyValue('--margin_venstre_tall') < -(fag_meny.style.width - skjermbredde)){
            r.style.setProperty('--margin_venstre_tall',-(fag_meny.style.width - skjermbredde));
        }
    } else{
        console.log('venstre');
        console.log(rs.getPropertyValue('--margin_venstre_tall'));
        /*Endrer margin-left og blar til venstre*/
        r.style.setProperty('--margin_venstre_tall', rs.getPropertyValue('--margin_venstre_tall') - (-blaLengde)); /* rs.getPropertyValue('--margin_venstre_tall') + blaLengde */
        if (rs.getPropertyValue('--margin_venstre_tall') > 0){
            r.style.setProperty('--margin_venstre_tall', 0);
        }
    }
    fag_meny.style.transitionDuration = "0.8s";
}

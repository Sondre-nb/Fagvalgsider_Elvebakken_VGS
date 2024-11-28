// Henter elementer fra html-filen
let hovedtekstEl = document.querySelector("#hovedtekst");
let terningkastTekstEl = document.querySelector("#terningkast-tekst");
let stoppKnappEl = document.querySelector("#stopp-knapp");
let satseKnappEl = document.querySelector("#satse-knapp");
let høyereKnappEl = document.querySelector("#høyere-knapp");
let lavereKnappEl = document.querySelector("#lavere-knapp");
let spillIgjenKnappEl = document.querySelector("#spill-igjen-knapp");
let poengEl = document.querySelector("#poeng");

let poeng = 0;
poengEl.innerHTML = "Poeng: " + poeng;
let terningkast = Math.floor(Math.random()*6) + 1;
let nesteKast = 0;
terningkastTekstEl.innerHTML = "du kastet en " + terningkast + "-er";

let sannsynlighetForÅHaKommetSåLangt = 1;

function sats() {
    hovedtekstEl.innerHTML = "Tror du det neste kastet er høyere eller lavere enn dette?";
    stoppKnappEl.style.display = "none";
    satseKnappEl.style.display = "none";
    lavereKnappEl.style.display = "block";
    høyereKnappEl.style.display = "block";
    tilpassStørrelse();
};

function gambling(valg) {
    nesteKast = Math.floor(Math.random()*6) + 1;
    if (valg == 'høyere'){
        if (nesteKast >= terningkast){
            sannsynlighetForÅHaKommetSåLangt *= (7-terningkast)/6;
            poeng++;
            nesteRunde();
        } else {
            poeng = 0;
            rundeOver(poeng);
        };
    } else if (valg == 'lavere'){
        if (nesteKast <= terningkast){
            poeng++;
            sannsynlighetForÅHaKommetSåLangt *= terningkast/6;
            nesteRunde();
        } else {
            poeng = 0;
            rundeOver(poeng);
        };
    };
};

function nesteRunde() {
    hovedtekstEl.innerHTML = "Det ble kastet en "+ nesteKast +"-er og du kom videre. Vil du satse eller stoppe?";
    stoppKnappEl.style.display = "block";
    satseKnappEl.style.display = "block";
    lavereKnappEl.style.display = "none";
    høyereKnappEl.style.display = "none";

    terningkast = Math.floor(Math.random()*6) + 1;
    terningkastTekstEl.innerHTML = "du kastet en " + terningkast + "-er";
    poengEl.innerHTML = "Poeng: " + poeng;
    tilpassStørrelse();
};

function rundeOver() {
    lavereKnappEl.style.display = "none";
    høyereKnappEl.style.display = "none";
    spillIgjenKnappEl.style.display = "block";

    terningkastTekstEl.innerHTML = "Det var en " + Math.round(sannsynlighetForÅHaKommetSåLangt*100) + "% sannsynlighet for at du kom så langt du gjorde";
    poengEl.innerHTML = "Poeng: " + poeng;
    hovedtekstEl.innerHTML = "Du tapte, det neste kastet ble en " + nesteKast + "-er";
    tilpassStørrelse();
};

function stopp() {
    stoppKnappEl.style.display = "none";
    satseKnappEl.style.display = "none";
    spillIgjenKnappEl.style.display = "block";

    terningkastTekstEl.innerHTML = "Det var en " + Math.round(sannsynlighetForÅHaKommetSåLangt*100) + "% sannsynlighet for at du kom så langt du gjorde";
    hovedtekstEl.innerHTML = "Du fikk " + poeng + " poeng";
    tilpassStørrelse();
}

// Resetter nettsiden for å kunne spille igjen
function spillIgjen() {
    terningkast = Math.floor(Math.random()*6) + 1;
    terningkastTekstEl.innerHTML = "du kastet en " + terningkast + "-er";
    sannsynlighetForÅHaKommetSåLangt = 1;
    poeng = 0;

    stoppKnappEl.style.display = "block";
    satseKnappEl.style.display = "block";
    spillIgjenKnappEl.style.display = "none";
    hovedtekstEl.innerHTML = "Vil du satse eller stoppe?";
    tilpassStørrelse();
}

let knapper = document.querySelectorAll("button");
let panelEl = document.querySelector("#panel");
let valg = document.querySelector("#valg");

// Finner de originale verdiene av variabler for å senere tilpasse til mindre skjermstørreler og lengre spørsmål, for så å kunne finne tilbake til det originale
const orgiginalHovedtekstFontSize = parseInt(getComputedStyle(hovedtekstEl).fontSize);
const orgiginalHovedtekstMargin = parseInt(getComputedStyle(hovedtekstEl).margin);
const orgiginalPanelMarginTop = parseInt(getComputedStyle(panelEl).marginTop);
const orgiginalKnappMargin = parseInt(getComputedStyle(knapper[0]).margin);
const orgiginalKnappFontSize = parseInt(getComputedStyle(knapper[0]).fontSize);
const orgiginalPoengFontSize = parseInt(getComputedStyle(poengEl).fontSize);
const orgiginalPoengPaddingTop = parseInt(getComputedStyle(poengEl).paddingTop);

// Tilpasser størrelsen til skjermbreddne ved å sette ned margin, padding og font-size
function tilpassStørrelse(){
    console.log("ting skjer");
    // Resetter verdiene som brukes til å tilpasse størrelsen
    hovedtekstEl.style.fontSize = orgiginalHovedtekstFontSize + "px";
    hovedtekstEl.style.margin = orgiginalHovedtekstMargin + "px";
    panelEl.style.marginTop = orgiginalPanelMarginTop + "px";
    poengEl.style.fontSize = orgiginalPoengFontSize + "px";
    poengEl.style.paddingTop = orgiginalPoengPaddingTop + "px";
    for (let i = 0; i < knapper.length; i++){
        knapper[i].style.margin = orgiginalKnappMargin + "px";
        knapper[i].style.fontSize = orgiginalKnappFontSize + "px";
    };
    // Minker alle størrelsene med 1 helt til de passer innenfor vinduet
    let vinduHøyde = window.innerHeight;
    let panelHøyde = panelEl.getBoundingClientRect().height; 
    let endring = 0;
    while (panelHøyde > vinduHøyde){
        endring++;
        for (i=0; i < knapper.length; i++){
            knapper[i].style.margin = orgiginalKnappMargin - endring + "px";
            knapper[i].style.fontSize = orgiginalKnappFontSize - endring + "px";
        };
        hovedtekstEl.style.fontSize = orgiginalHovedtekstFontSize - endring + "px";
        hovedtekstEl.style.margin = orgiginalHovedtekstMargin - endring + "px";
        panelEl.style.marginTop = orgiginalPanelMarginTop - endring + "px";
        poengEl.style.fontSize = orgiginalPoengFontSize - endring + "px";
        poengEl.style.paddingTop = orgiginalPoengPaddingTop - endring + "px";

        panelHøyde = panelEl.getBoundingClientRect().height; 
    };

    let vinduBredde = window.innerWidth;
    let valgBredde = valg.getBoundingClientRect().width;
    console.log(valgBredde);
    endring = 0;
    while (valgBredde >= vinduBredde){
        endring++;
        console.log("Vi er inni while-løkka for bredden. margin: " + (orgiginalKnappMargin-endring) + "px");
        for (i=0; i < knapper.length; i++){
            knapper[i].style.margin = orgiginalKnappMargin - endring + "px";
            knapper[i].style.fontSize = orgiginalKnappFontSize - endring + "px";
        };
        valgBredde = valg.getBoundingClientRect().width;
    };
};

// Tilpasser størrelsen når skjermstørrelsen endres og når siden er ferdig lastet
window.addEventListener('resize', tilpassStørrelse);
document.addEventListener("DOMContentLoaded", function(event){
    tilpassStørrelse();
  });
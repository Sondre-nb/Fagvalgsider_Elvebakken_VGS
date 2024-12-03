let spørsmålNr = 0;
let poeng = 0;
let valgt_alernativ = "ingen";

let svarKnappEl = document.querySelector("#svarknapp");
let spillIgjenKnappEl = document.querySelector("#spill-igjen-knapp");

let poengEl = document.querySelector("#poeng");
poengEl.innerHTML = "Poeng: " + poeng + "/" + spørsmålNr;

let spørsmålEl = document.querySelector("#spørsmål");
spørsmålEl.innerHTML = spørsmålListe[spørsmålNr]["spørsmål"];

let alternativer = document.querySelectorAll(".alternativ");
for (let i = 0; i < alternativer.length; i++){
    alternativer[i].innerHTML = spørsmålListe[spørsmålNr]["alternativer"][i];
    alternativer[i].addEventListener("click", function(){velgAlternativ(i)});
}

// Lagrer hvilket alternativ som er valgt og bytter bakgrunnsfargen til det alternativet
function velgAlternativ(alternativNummer){
    valgt_alernativ = alternativNummer;

    for (let i = 0; i < alternativer.length; i++){
        //bytter fargen til alle alternativene til standarden (elvebakken-rosa)
        alternativer[i].style.backgroundColor = "#DC8EB6";
    }
    // bytter fargen til det valgte alternativet til elvebakken-blå
    alternativer[valgt_alernativ].style.backgroundColor = "#74b2e1";
}

//Bytter til neste spørsmål
function nesteSpørsmål(){
    spørsmålNr++;
    poengEl.innerHTML = "Poeng: " + poeng + "/" + spørsmålNr;
    if (spørsmålNr==spørsmålListe.length){ //sjekker om brukeren er på siste spørsmål
        // Skjuler alternativene og spill-igjen-knappen, viser poengn i spørsmålsteksten og viser spill-igjen-knappen
        spørsmålEl.innerHTML = "Du fikk " + poeng + " av " + spørsmålListe.length + " mulige poeng!";
        for (let i = 0; i < alternativer.length; i++){
            alternativer[i].style.display = "none";
        };
        svarKnappEl.style.display = "none";
        spillIgjenKnappEl.style.display = "block";
    } else{ // Bytter spørsmål og alternativene til det neste
        spørsmålEl.innerHTML = spørsmålListe[spørsmålNr]["spørsmål"];
        for (let i = 0; i < alternativer.length; i++){
            alternativer[i].innerHTML = spørsmålListe[spørsmålNr]["alternativer"][i];
            alternativer[i].style.backgroundColor = "#DC8EB6";
        };
        valgt_alernativ = "ingen";
    };
    tilpassStørrelse();
};

// Sjekker om svaret til brukeren er riktig, øker poengn hvis det er, og så kaller på funksjonen for å gå videre til neste spørsmål
function sjekkSvar(){
    if (valgt_alernativ == "ingen"){
        nesteSpørsmål();
    } else if (spørsmålListe[spørsmålNr]["alternativer"][valgt_alernativ] == spørsmålListe[spørsmålNr]["svar"]){
        poeng++;
        nesteSpørsmål();
    } else{
        nesteSpørsmål();
    };
};

// Resetter variabler, farger og hva som skal vises for å starte en ny runde
function spillIgjen(){
    spørsmålNr = 0;
    for (let i = 0; i < alternativer.length; i++){
        alternativer[i].style.display = "block";
        alternativer[i].innerHTML = spørsmålListe[spørsmålNr]["alternativer"][i];
        alternativer[i].style.backgroundColor = "#DC8EB6";
    };
    svarKnappEl.style.display = "block";
    spillIgjenKnappEl.style.display = "none";
    poeng = 0;
    poengEl.innerHTML = "poeng: " + poeng;
    spørsmålEl.innerHTML = spørsmålListe[spørsmålNr]["spørsmål"];
    valgt_alernativ = "ingen";
    tilpassStørrelse();
};

let alternativOmråde = document.querySelector("#alternativ-område");
let panelEl = document.querySelector("#panel");

// Finner de originale verdiene av variabler for å senere tilpasse til mindre skjermstørreler og lengre spørsmål, for så å kunne finne tilbake til det originale
const orgiginalAlternativerPadding = parseInt(getComputedStyle(alternativer[0]).padding);
const orgiginalAlternativOmrådeGap = parseInt(getComputedStyle(alternativOmråde).gap);
const orgiginalAlternativOmrådeMargin = parseInt(getComputedStyle(alternativOmråde).margin);
const orgiginalAlternativOmrådeFontSize = parseInt(getComputedStyle(alternativOmråde).fontSize);
const orgiginalSpørsmålFontSize = parseInt(getComputedStyle(spørsmålEl).fontSize);
const orgiginalSpørsmålMargin = parseInt(getComputedStyle(spørsmålEl).margin);
const orgiginalPanelMarginTop = parseInt(getComputedStyle(panelEl).marginTop);
const orgiginalSvarKnappMarginTop = parseInt(getComputedStyle(svarKnappEl).marginTop);
const orgiginalSvarKnappFontSize = parseInt(getComputedStyle(svarKnappEl).fontSize);
const orgiginalPoengFontSize = parseInt(getComputedStyle(poengEl).fontSize);
const orgiginalPoengPaddingTop = parseInt(getComputedStyle(poengEl).paddingTop);

function tilpassStørrelse(){

    // Resetter verdiene som brukes til å tilpasse størrelsen
    for (let i = 0; i < alternativer.length; i++){
        alternativer[i].style.padding = orgiginalAlternativerPadding;
    };
    alternativOmråde.style.gap = orgiginalAlternativOmrådeGap + "px";
    alternativOmråde.style.margin = orgiginalAlternativOmrådeMargin + "px";
    alternativOmråde.style.fontSize = orgiginalAlternativOmrådeFontSize + "px";
    spørsmålEl.style.fontSize = orgiginalSpørsmålFontSize + "px";
    spørsmålEl.style.margin = orgiginalSpørsmålMargin + "px";
    panelEl.style.marginTop = orgiginalPanelMarginTop + "px";
    svarKnappEl.style.marginTop = orgiginalSvarKnappMarginTop + "px";
    svarKnappEl.style.fontSize = orgiginalSvarKnappFontSize + "px";
    poengEl.style.fontSize = orgiginalPoengFontSize + "px";
    poengEl.style.paddingTop = orgiginalPoengPaddingTop + "px";
    alternativOmråde.style.display = "grid";
    alternativOmråde.style.gridTemplateColumns = "repeat(2, 1fr)";

    let vinduBredde = window.innerWidth;
    let alternativOmrådeTotalBredde = alternativOmråde.getBoundingClientRect().width + 2*orgiginalAlternativOmrådeMargin;

    // Legger svaralternativene under hverandre om de tar for mye plass om de er to i bredden
    if (alternativOmrådeTotalBredde >= vinduBredde){
        alternativOmråde.style.display = "flex";
        alternativOmråde.style.flexDirection = "column";
    };
    
    // Minker alle størrelsene med 1 helt til de passer innenfor vinduet
    let vinduHøyde = window.innerHeight;
    let panelHøyde = panelEl.getBoundingClientRect().height; 
    let endring = 0;
    while (panelHøyde > vinduHøyde){
        endring++;
        alternativOmråde.style.gap = orgiginalAlternativOmrådeGap - endring + "px";
        alternativOmråde.style.margin = orgiginalAlternativOmrådeMargin - endring + "px";
        alternativOmråde.style.fontSize = orgiginalAlternativOmrådeFontSize - endring + "px";
        spørsmålEl.style.fontSize = orgiginalSpørsmålFontSize - endring + "px";
        spørsmålEl.style.margin = orgiginalSpørsmålMargin - endring + "px";
        panelEl.style.marginTop = orgiginalPanelMarginTop - endring + "px";
        svarKnappEl.style.marginTop = orgiginalSvarKnappMarginTop - endring + "px";
        svarKnappEl.style.fontSize = orgiginalSvarKnappFontSize - endring + "px";
        poengEl.style.fontSize = orgiginalPoengFontSize - endring + "px";
        poengEl.style.paddingTop = orgiginalPoengPaddingTop - endring + "px";

        panelHøyde = panelEl.getBoundingClientRect().height; 
    };
};

window.addEventListener('resize', tilpassStørrelse);
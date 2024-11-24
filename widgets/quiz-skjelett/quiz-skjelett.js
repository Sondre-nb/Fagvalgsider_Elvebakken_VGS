let spørsmålListe = [
                    {"spørsmål":"Hva er 1+1?", "alternativer":[1, 2, 3, 4], "svar":2},
                    {"spørsmål":"Hva er 1+2?", "alternativer":["Weimarrepublikken", 3, 2, 100], "svar":3},
                    {"spørsmål":"Hva er hovedstaden i Oslo?", "alternativer":["Weimarrepublikken", "Røa", "Hovseter", "Sarabråtveien 11B :("], "svar":"Hovseter"}
                    ];

let spørsmålNr = 0;
let score = 0;
let valgt_alernativ = "ingen";

let svarKnappEl = document.querySelector("#svarknapp");
let spillIgjenKnappEl = document.querySelector("#spill-igjen-knapp");

let scoreEl = document.querySelector("#score");
scoreEl.innerHTML = "score: " + score;

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
    if (spørsmålNr==spørsmålListe.length){ //sjekker om brukeren er på siste spørsmål
        // Skjuler alternativene og spill-igjen-knappen, viser scoren i spørsmålsteksten og viser spill-igjen-knappen
        spørsmålEl.innerHTML = "Du er ferdig og fikk en score på " + score;
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
};

// Sjekker om svaret til brukeren er riktig, øker scoren hvis det er, og så kaller på funksjonen for å gå videre til neste spørsmål
function sjekkSvar(){
    if (valgt_alernativ == "ingen"){
        nesteSpørsmål();
    } else if (spørsmålListe[spørsmålNr]["alternativer"][valgt_alernativ] == spørsmålListe[spørsmålNr]["svar"]){
        score++;
        scoreEl.innerHTML = "score: " + score
        nesteSpørsmål();
    } else{
        nesteSpørsmål();
    }
}

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
    score = 0;
    scoreEl.innerHTML = "score: " + score;
    spørsmålEl.innerHTML = spørsmålListe[spørsmålNr]["spørsmål"];
    valgt_alernativ = "ingen";
}

function tilpassHøyde(){
    let høyde = document.querySelector("panel").getBoundingClientRect().height;
    while (høyde > 570){
        console.log("Ting skjer")
    }
}



window.addEventListener("resize", tilpassHøyde())
let alternativer = document.getElementsByClassName("alternativ");
let alternativ_boks = document.getElementById("alternativer");
let svarbokser = document.getElementsByClassName("svar-boks");
let sjekk_svar = document.getElementById("sjekk-svar");
let nullstill = document.getElementById("nullstill");

// Lar deg dra alternativer inn og ut av svarboksene
// Sjekker om hver av alternativene blir dratt
for (alternativ of alternativer) {
    alternativ.addEventListener("dragstart", function(e){
        for (let i = 0; i < svarbokser.length; i++) {
            svarbokser[i].style.backgroundColor = "white"; // Nullstiller farger om man har sjekket svar
        }
        let selected = e.target; // diven med teksten man drar på
        /* selected.style.borderRadius = "10px"; */ //Prøvde å fjerne oransje bakgrunn bak de runde hjørnene
        for (svarboks of svarbokser) {
            svarboks.addEventListener("dragover", function(e){
                e.preventDefault();
            });
            // Legger til hover-effekt på den boksen man drar tekst over
            svarboks.addEventListener('dragenter', function() {
                if (this.innerHTML == "") {
                    this.style.backgroundColor = "#dddddd";
                }
            });
            svarboks.addEventListener('dragleave', function() {
                this.style.backgroundColor = "white";
            })
            // Plasserer div-en inni svar-boks om den er tom
            svarboks.addEventListener('drop', function(){
                if (this.innerHTML == "") {
                    this.appendChild(selected)
                }
                selected = null;
                this.style.backgroundColor = "white";
            });
        }
        // Lar deg dra tekst ut av svar-boksene igjen
        alternativ_boks.addEventListener("dragover", function(e){
            e.preventDefault();
        });
        alternativ_boks.addEventListener('drop', function(){
            this.appendChild(selected);
            selected = null;
        });
    })
}

// Sjekker om 'sjekk svar!'-knappen er trykket
sjekk_svar.addEventListener("click", function () {
    // Svarene er i samme rekkefølge som kategoriene
    let svar = [
        'Magmatisk',
        'Metamorfisk',
        'Sedimentær'
    ];
    // Endrer bakgrunnsfarge på svar-bokser basert på om svar er riktig eller ikke
    for (let i = 0; i < alternativer.length; i++) {
        if (svarbokser[i].innerHTML != "") {
            if (svar[i] == svarbokser[i].querySelector('.alternativ').innerHTML) {
                svarbokser[i].style.backgroundColor = "#CCFFC5";
            } else {
                svarbokser[i].style.backgroundColor = "#FFD9C5";
            }
        } else {
            svarbokser[i].style.backgroundColor = "#FFD9C5";
        }
    }
});

// Sjekker om 'nullstill'-knappen er trykket
// Fjerner farge fra svar-bokser
// Putter all tekst tilbake i alternativ-boks
nullstill.addEventListener("click", function () {
    for (let i = 0; i < svarbokser.length; i++) {
        svarbokser[i].style.backgroundColor = "white";
        if (svarbokser[i].innerHTML != "") {
            alternativ_boks.appendChild(svarbokser[i].querySelector('.alternativ'));
        }
    }
});
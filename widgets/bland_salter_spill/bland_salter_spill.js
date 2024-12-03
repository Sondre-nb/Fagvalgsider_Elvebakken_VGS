let salter = document.getElementsByClassName("salt");
let saltplasseringsfelt = document.getElementsByClassName("saltplassering");
let saltplasseringer = [];
let aktivt_salt_plassering = document.getElementById("aktivt-salt");
let reaksjonslikning = document.getElementById("reaksjonslikning");
let reaksjonstype = document.getElementById("reaksjonstype");
let spillbredde = document.querySelector('body').getBoundingClientRect().width;
let begerglassbredde = document.querySelector('#begerglass img').getBoundingClientRect().width;
let reagensrørhøyde = document.querySelector('.salt img').getBoundingClientRect().height;
let reagensrørplassering = spillbredde/2 - begerglassbredde/2 - reagensrørhøyde/2;
let r = document.querySelector(':root');
r.style.setProperty('--helleplassering', reagensrørplassering + "px");
let x = 0;
let y = 0;
let blandbare_salter = [];
let nullstill_knapp = document.querySelector('#nullstill-knapp').querySelector('button');

let løsningsnavn_tabell =  [[["x"], ["AgCl(s) + NH4NO3(aq)"], ["-"], ["NH3(g) + NaCl(aq) + H2O(l)"], ["-"], ["-"], ["-"]],
                            [["x"], ["x"], ["Ag2SO4(s) + CuNO3(aq)"], ["Ag2O(s) + 2NaNO3(aq) + H2O(l)"], ["-"], ["Ag2CO3(s) + NaNO3(aq)"], ["AgCl(s) + Ca(NO3)2(aq)"]],
                            [["x"], ["x"], ["x"], ["CuOH2(s) + Na2SO4(aq)"], ["BaSO4(s) + Cu(NO3)2(aq)"], ["CuCO3(s) + Na2SO4(aq)"], ["CaSO4(s) + CuCl2(aq)"]],
                            [["x"], ["x"], ["x"], ["x"], ["-"], ["-"], ["Ca(OH)2(s) + NaCl(aq)"]],
                            [["x"], ["x"], ["x"], ["x"], ["x"], ["BaCO3(s) + 2NaNO3(aq)"], ["-"]],
                            [["x"], ["x"], ["x"], ["x"], ["x"], ["x"], ["CaCO3(s) + 2NaCl(aq)"]],
                            [["x"], ["x"], ["x"], ["x"], ["x"], ["x"], ["x"]]];

let løsningsfarge_tabell = [[["x"], ["linear-gradient(0deg,rgba(102, 87, 90, 1)  20%, rgba(102, 87, 90, 0.5)  20%, rgba(102, 87, 90, 0.2)  95%, rgb(102, 87, 90) 95%)"], ["-"], ["linear-gradient(0deg,rgba(219, 230, 243, 0)  95%, rgb(161, 181, 192) 95%"], ["-"], ["-"], ["-"]],
                            [["x"], ["x"], ["linear-gradient(0deg,rgb(255, 255, 255)  20%, rgba(128, 209, 205, 0.2)  20%, rgba(128, 209, 205, 0.2)  95%, rgba(109, 187, 197, 0.5) 95%)"], ["linear-gradient(0deg,rgb(168, 124, 58)  20%, rgba(141, 93, 22, 0.8)  20%, rgba(155, 126, 45, 0.4)  95%, rgba(136, 113, 49, 0.6) 95%)"], ["-"], ["linear-gradient(0deg,rgb(87, 83, 63)  20%, rgba(87, 83, 63, 0.3)  20%, rgba(87, 83, 63, 0.3)  95%, rgba(87, 83, 63, 0.5) 95%)"], ["linear-gradient(0deg,rgb(255, 255, 255)  20%, rgba(255, 255, 255, 0.1)  20%, rgba(255, 255, 255, 0.1)  95%, rgb(255, 255, 255, 0.5) 95%, rgb(255, 255, 255, 0.5) 98%, rgb(163, 159, 150, 0.3) 98%)"]],
                            [["x"], ["x"], ["x"], ["linear-gradient(0deg,rgb(55, 156, 177)  20%, rgba(46, 133, 150, 0)  20%, rgba(102, 87, 90, 0)  95%, rgb(102, 156, 147) 95%)"], ["linear-gradient(0deg,rgb(255, 255, 255)  20%, rgba(255, 255, 255, 0.4)  20%, rgba(255, 255, 255, 0.4)  95%, rgba(170, 170, 169, 0.5) 95%)"], ["linear-gradient(0deg,rgb(175, 207, 212)  20%, rgba(210, 248, 255, 0.3)  20%, rgba(210, 248, 255, 0.3)  95%, rgba(129, 155, 155, 0.5) 95%)"], ["linear-gradient(0deg, rgb(164, 214, 243, 0.2)  95%, rgb(255, 255, 255, 0.5) 95%, rgb(255, 255, 255, 0.5) 98%, rgba(150, 161, 163, 0.3) 98%)"]],
                            [["x"], ["x"], ["x"], ["x"], ["-"], ["-"], ["linear-gradient(0deg,rgb(255, 255, 255)  20%, rgba(255, 255, 255, 0.1)  20%, rgba(255, 255, 255, 0.1)  95%, rgb(255, 255, 255, 0.5) 95%, rgb(255, 255, 255, 0.5) 98%, rgb(163, 159, 150, 0.3) 98%)"]],
                            [["x"], ["x"], ["x"], ["x"], ["x"], ["linear-gradient(0deg,rgb(255, 255, 255)  20%, rgba(255, 255, 255, 0.1)  20%, rgba(255, 255, 255, 0.1)  95%, rgb(255, 255, 255, 0.5) 95%, rgb(255, 255, 255, 0.5) 98%, rgb(163, 159, 150, 0.3) 98%)"], ["-"]],
                            [["x"], ["x"], ["x"], ["x"], ["x"], ["x"], ["linear-gradient(0deg,rgb(255, 255, 255)  20%, rgba(255, 255, 255, 0.1)  20%, rgba(255, 255, 255, 0.1)  95%, rgb(255, 255, 255, 0.5) 95%, rgb(255, 255, 255, 0.5) 98%, rgb(163, 159, 150, 0.3) 98%)"]],
                            [["x"], ["x"], ["x"], ["x"], ["x"], ["x"], ["x"]]];

let reaksjonstype_tabell = [[["x"], ["fellingsreaksjon"], ["-"], ["syre-base-reaksjon"], ["-"], ["-"], ["-"]],
                            [["x"], ["x"], ["fellingsreaksjon"], ["fellingsreaksjon"], ["-"], ["fellingsreaksjon"], ["fellingsreaksjon"]],
                            [["x"], ["x"], ["x"], ["fellingsreaksjon"], ["fellingsreaksjon"], ["fellingsreaksjon"], ["fellingsreaksjon"]],
                            [["x"], ["x"], ["x"], ["x"], ["-"], ["-"], ["fellingsreaksjon"]],
                            [["x"], ["x"], ["x"], ["x"], ["x"], ["fellingsreaksjon"], ["-"]],
                            [["x"], ["x"], ["x"], ["x"], ["x"], ["x"], ["fellingsreaksjon"]],
                            [["x"], ["x"], ["x"], ["x"], ["x"], ["x"], ["x"]]];

function finnProdukt() {
    reaksjonslikning.innerHTML += " → " + løsningsnavn_tabell[y][x];
    reaksjonstype.innerHTML += reaksjonstype_tabell[y][x];
    if (reaksjonstype_tabell[y][x] == "fellingsreaksjon") {
        reaksjonstype.style.backgroundColor = "var(--elvebakken_rosa)";
    } else {
        reaksjonstype.style.backgroundColor = "var(--lyse_grønn)";
    }
    document.getElementById("disclaimer").style.display = "block";
};

function finnTabellplassering() {
    x = saltplasseringer[0];
    y = saltplasseringer[1];
    if (løsningsnavn_tabell[y][x] == "x") {
        x = saltplasseringer[1];
        y = saltplasseringer[0];
    };
};

function finnBlandbareSalter() {
    let temp_counter = 0;
    while (løsningsnavn_tabell[temp_counter][saltplasseringer[0]] != "x") {
        if (løsningsnavn_tabell[temp_counter][saltplasseringer[0]] != "-") {
            blandbare_salter.push(salter[temp_counter].id);
        } else {
            salter[temp_counter].style.opacity = "0.3";
        }
        temp_counter++;
    };
    let row = temp_counter;
    temp_counter++;
    while (løsningsnavn_tabell[row][temp_counter] != "x" && temp_counter < 7) {
        if (løsningsnavn_tabell[row][temp_counter] != "-") {
            blandbare_salter.push(salter[temp_counter].id);
        } else {
            salter[temp_counter].style.opacity = "0.3";
        }
        temp_counter++;
    }
};

function leggTilSalt(saltplassering, aktivt_salt) {
    let gammel_løsningshøyde = getComputedStyle(document.documentElement).getPropertyValue('--slutthøyde');
    r.style.setProperty('--starthøyde', gammel_løsningshøyde);
    let løsningshøyde = 50 * saltplasseringer.length + "px";
    r.style.setProperty('--slutthøyde', løsningshøyde);

    let saltfarge = window.getComputedStyle(aktivt_salt.querySelector(".saltfarge")).background;
    let løst_salt = aktivt_salt.querySelector(".saltfarge");
    if (saltplasseringer.length == 1) {
        r.style.setProperty('--original_farge', saltfarge);
        r.style.setProperty('--ny_farge', saltfarge);
    } else {
        finnTabellplassering();
        r.style.setProperty('--original_farge', getComputedStyle(document.documentElement).getPropertyValue('--ny_farge'));
        let produkt_farge = løsningsfarge_tabell[y][x];
        r.style.setProperty('--ny_farge', produkt_farge);
    }
    let løsning = document.getElementById("løsningsfarge");
    løsning.style.animation = 'fyll_begerglass 2s ease';
    løst_salt.style.animation = 'hell_salt 2s ease';
    løsning.style.background = "var(--ny_farge)";
    løsning.style.height = løsningshøyde;
    løst_salt.style.height = "0px";
    setTimeout(() => {
        løsning.style.animation = "";
        løst_salt.style.animation = "";
        saltplasseringsfelt[saltplassering].append(aktivt_salt);
        if (saltplasseringer.length == 1) { 
            finnBlandbareSalter();
        } else {
            finnProdukt();
        }
    }, 2000);
};

for (salt of salter) {
    salt.addEventListener("click", function(){
        if (aktivt_salt_plassering.innerHTML == "" && saltplasseringer.length <= 1 && window.getComputedStyle(this.querySelector(".saltfarge")).height != "0px" && window.getComputedStyle(this).opacity != "0.3") {
            aktivt_salt = this;
            let saltplassering = 0;
            for (i = 0; i < salter.length; i++) {
                if (aktivt_salt == salter[i]) {
                    saltplassering = i;
                    saltplasseringer.push(saltplassering);
                };
            };
            aktivt_salt_plassering.append(aktivt_salt);
            let saltType = aktivt_salt.querySelector(".saltnavn").innerHTML;
            if (saltplasseringer.length == 2) {
                reaksjonslikning.innerHTML += " + ";
            }
            reaksjonslikning.innerHTML += saltType + "(s)";
            leggTilSalt(saltplassering, aktivt_salt);
        };
    });
};

nullstill_knapp.onclick = function() {
    reaksjonslikning.innerHTML = "";
    reaksjonstype.innerHTML = "Reaksjonstype: ";
    reaksjonstype.style.backgroundColor = "rgb(187, 187, 187)";
    for (salt of salter) {
        salt.style.opacity = "1";
        salt.querySelector('.saltfarge').style.height = "150px";
    };
    document.getElementById("løsningsfarge").style.height = "0px";
    saltplasseringer = [];
    blandbare_salter = [];
    r.style.setProperty('--slutthøyde', "0px");
};

window.onresize = function() {
    let spillbredde = document.querySelector('body').getBoundingClientRect().width;
    let begerglassbredde = document.querySelector('#begerglass img').getBoundingClientRect().width;
    let reagensrørhøyde = document.querySelector('.salt img').getBoundingClientRect().height;
    let r = document.querySelector(':root');
    let reagensrørplassering = spillbredde/2 - begerglassbredde/2 - reagensrørhøyde/2;
    r.style.setProperty('--helleplassering', reagensrørplassering + "px");
}
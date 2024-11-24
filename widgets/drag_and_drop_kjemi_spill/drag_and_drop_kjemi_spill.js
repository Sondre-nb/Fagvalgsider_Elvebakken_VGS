let påstander = document.getElementsByClassName("påstand");
let påstand_boks = document.getElementById("påstander");
let svarbokser = document.getElementsByClassName("svar-boks");
let sjekk_svar = document.getElementById("sjekk-svar");
let nullstill = document.getElementById("nullstill");

// Lar deg dra påstander inn og ut av svarboksene 
// Sjekker om hver av påstandene blir dratt
for (påstand of påstander) {
    påstand.addEventListener("dragstart", function(e){
        for (let i = 0; i < svarbokser.length; i++) {
            svarbokser[i].style.backgroundColor = "white"; // Nullstiller farger om man har sjekket svar
        }
        let selected = e.target; // diven med teksten man drar på
        selected.style.filter = "brightness(80%)"; // Gjør at drag-element ikke arver bakgrunnsfarge fra div
        for (svarboks of svarbokser) {
            svarboks.addEventListener("dragover", function(e){
                e.preventDefault();
            });
            // Legger til hover-effekt på den boksen man drar tekst over
            svarboks.addEventListener('dragenter', function() {
                if (this.innerHTML == "") {
                    this.style.backgroundColor = "#dddddd";
                }
            })
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
        påstand_boks.addEventListener("dragover", function(e){
            e.preventDefault();
        });
        påstand_boks.addEventListener('drop', function(){
            this.appendChild(selected);
            selected = null;
        });
    })
}

// Sjekker om 'sjekk svar!'-knappen er trykket
sjekk_svar.addEventListener("click", function () {
    // Svarene er i samme rekkefølge som kategoriene
    let svar = [
        '"Hvis jeg blander to mol hydrogengass med ett mot oksygengass, får jeg dannet ett mol vann"',
        '"Når vann fryser til is, gir det fra seg varme"',
        '"Hvis jeg blander eddik og natron får jeg dannet vann og karbondioksid"',
        '"Etanol har en OH-gruppe og er derfor blandbar med vann"'
    ];
    // Endrer bakgrunnsfarge på svar-bokser basert på om svar er riktig eller ikke
    for (let i = 0; i < påstander.length; i++) {
        if (svarbokser[i].innerHTML != "") {
            if (svar[i] == svarbokser[i].querySelector('.påstand').innerHTML) {
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
// Putter all tekst tilbake i påstand-boks
nullstill.addEventListener("click", function () {
    for (let i = 0; i < svarbokser.length; i++) {
        svarbokser[i].style.backgroundColor = "white";
        if (svarbokser[i].innerHTML != "") {
            påstand_boks.appendChild(svarbokser[i].querySelector('.påstand'));
        }
    }
});
/*
ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
let dragged = null;
for (let i = 0; i < påstander.length; i++) {
    let påstand = påstander[i];

    påstand.addEventListener('dragstart', function(e) {
        console.log('dragstart')
        dragged = this;
    });

    påstand.addEventListener('dragend', function(e) {
        console.log('draggend')
        dragged = null;
    });

    for (let j = 0; j < svarbokser.length; j++) {
        let svarboks = svarbokser[j];
    }
}*/
/*
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}*/

/*
for (svarboks of svarbokser) {
            svarboks.addEventListener("drop", function(e){
                svarboks.appendChild(selected);
                selected = null;
            })
        }
//til drag an drop brukte jeg dette som utgagspunkt: https://www.w3schools.com/html/html5_draganddrop.asp
let justDraggedFrom;
function allowDrop(ev) {
    ev.preventDefault();
  }

function drag(ev) {
    if (ev.target.children.length == 0){
        return
    }
    ev.dataTransfer.setData("text", ev.target.id);  
    justDraggedFrom = ev.target.parentElement;
  
}

function drop(ev) {
    
    let container = ev.target
    if (container.children.length < 1){
        container.innerHTML = ""
        var data = ev.dataTransfer.getData("text");
        container.appendChild(document.getElementById(data));
        stophover(ev)}
    else if(justDraggedFrom !== container && container !== justDraggedFrom.children[0]){
        if (container.classList.contains("svar")){
            container = container.parentElement;
        }
        let child = container.children[0]
        container.innerHTML = ""
        var data = ev.dataTransfer.getData("text");
        container.appendChild(document.getElementById(data));
        justDraggedFrom.appendChild(child);
        stophover(ev)}
    else{
        stophover(ev)}
    }

   
function getId(ev){
    let element = ev.target
    return element.id}

function hover(event){

    let element = event.target;
    element.style.filter = "brightness(80%)";

}

function stophover(event){
    let element = event.target;


    element.style.filter = "brightness(100%)";


}
slippBoxer = document.querySelectorAll(".slippHer")

function sjekkSvar(){
    slippBoxer.forEach(element => {
        if (element.children.length > 0){
            let id = element.id;
            let barn = element.children;
            let barnId = barn[0].id;
            //brukt chatgpt for regex   
            let idNumber = id.match(/\d+$/)[0]; 
            let barnIdNumber = barnId.match(/\d+$/)[0];

            if (idNumber === barnIdNumber){
                element.style.borderColor = "#03F3A5";
            }
            else{
                element.style.borderColor = "#FF464E";
            }}
        else{
            element.style.borderColor = "#FF464E";}
        
        
    });
}
*/
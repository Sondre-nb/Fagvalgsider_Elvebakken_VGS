let kort = document.getElementsByClassName("kort");
let antall_kort = kort.length;
let kort_stokker = document.getElementById("temp_stokker");
let stokket_kort = document.getElementById("stokket_kort");
let snudd_kort = [];
let snudd_kort_divs = [];
let nullstill_knapp = document.querySelector('#nullstill-knapp').querySelector('button');
console.log(kort)

function stokkKort() {
    for (i = antall_kort; i > 0; i--) {
        //console.log(Math.floor(Math.random() * i));
        kort_stokker.append(kort[Math.floor(Math.random() * i)])
    }
    console.log(kort_stokker)
    let kort_stokket = kort_stokker.querySelectorAll('.kort');
    console.log(antall_kort);
    for (i = 0; i < antall_kort; i++) {
        console.log(kort_stokket[i])
        stokket_kort.append(kort_stokket[i])
    }
    console.log(kort)
};

function snuTilbake() {
    setTimeout(() => {
        for (let i = 0; i < 2; i++) {
            snudd_kort_divs[i].querySelector(".snudd-kort").style.display = "none";
            snudd_kort_divs[i].querySelector(".skjult-kort").style.display = "grid";
        };
        snudd_kort = [];
        snudd_kort_divs = [];
    }, 1200);
};

for (enkelt_kort of kort) {
    enkelt_kort.addEventListener("click", function(){
        let valgt_kort = this;
        if (window.getComputedStyle(this.querySelector(".snudd-kort"), null).display == 'none' && snudd_kort.length != 2) {
            this.querySelector(".snudd-kort").style.display = "block";
            this.querySelector(".skjult-kort").style.display = "none";
            snudd_kort.push(this.className)
            snudd_kort_divs.push(this)
            console.log(snudd_kort)
            console.log(snudd_kort_divs)
            if (snudd_kort.length == 2) {
                if (snudd_kort[0] != snudd_kort[1]) {
                    snuTilbake();
                } else {
                    snudd_kort = [];
                    snudd_kort_divs = [];
                };
            };
        };
        console.log(valgt_kort)
    });
};

nullstill_knapp.onclick = function() {
    snudd_kort = [];
    snudd_kort_divs = [];
    for (enkelt_kort of kort) {
        enkelt_kort.querySelector(".snudd-kort").style.display = "none";
        enkelt_kort.querySelector(".skjult-kort").style.display = "grid";
    };
    stokkKort();
};

stokkKort();

let kort = document.getElementsByClassName("kort");
let antall_kort = kort.length;
let kort_stokker = document.getElementById("temp_stokker");
let stokket_kort = document.getElementById("stokket_kort")
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

for (enkelt_kort of kort) {
    enkelt_kort.addEventListener("click", function(){
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
}



stokkKort();

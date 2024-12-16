let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "grid";
    skalerBilde();
    let bakgrunn = slides[slideIndex-1].querySelector('img').src;
    slides[slideIndex-1].style.backgroundImage = "url('" + bakgrunn + "')";
    dots[slideIndex-1].className += " active";
}

function skalerBilde () {
    let slides = document.getElementsByClassName("mySlides");
    console.log(slides)
    let slides_container = document.getElementById("slideshow-container");
    let bredde_bilde = slides[slideIndex-1].querySelector('img').getBoundingClientRect().width;
    let hoyde_bilde = slides[slideIndex-1].querySelector('img').getBoundingClientRect().height;
    console.log("Bilde:" + slides[slideIndex-1].querySelector('img'))
    console.log("Høyde: " + slides[slideIndex-1].querySelector('img').getBoundingClientRect().height)
    console.log("Bredde: " + slides[slideIndex-1].querySelector('img').getBoundingClientRect().width)

/*     while (bredde_bilde == 0 || hoyde_bilde == 0){
        slides = document.getElementsByClassName("mySlides");
        bredde_bilde = slides[slideIndex-1].querySelector('img').getBoundingClientRect().width;
        hoyde_bilde = slides[slideIndex-1].querySelector('img').getBoundingClientRect().height;    
    } */

    let bredde_totalt = slides[slideIndex-1].getBoundingClientRect().width;
    if (bredde_bilde > bredde_totalt) {
        console.log("Ting burde bli mindre")
        slides[slideIndex-1].querySelector('img').style.height = "auto";
        slides[slideIndex-1].querySelector('img').style.width = "100%";
        slides[slideIndex-1].querySelector('img').style.borderRadius = "15px";
        slides_container.style.height = "auto";
    }
    if (hoyde_bilde > 400) {
        slides[slideIndex-1].querySelector('img').style.height = "400px";
        slides[slideIndex-1].querySelector('img').style.borderRadius = "0px";
        slides[slideIndex-1].querySelector('img').style.width = "unset";
    }
    console.log("Funksjonen har i det minste kjørt og bredde bilde = " + bredde_bilde + " og bredde_totalt = " + bredde_totalt)
};

function test() {
    console.log("Hei")
}

document.addEventListener("DOMContentLoaded", test);
document.addEventListener("DOMContentLoaded", skalerBilde);
/* document.addEventListener("DOMContentLoaded", function(){
    setTimeout(skalerBilde, 500)
}); */
window.addEventListener("resize", skalerBilde);
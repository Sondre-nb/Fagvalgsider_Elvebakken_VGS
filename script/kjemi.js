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
    let slides_container = document.getElementById("slideshow-container");
    let bredde_bilde = slides[slideIndex-1].querySelector('img').getBoundingClientRect().width;
    let hoyde_bilde = slides[slideIndex-1].querySelector('img').getBoundingClientRect().height;
    let bredde_totalt = slides[slideIndex-1].getBoundingClientRect().width;
    if (bredde_bilde > bredde_totalt) {
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
};

window.addEventListener("resize", skalerBilde);
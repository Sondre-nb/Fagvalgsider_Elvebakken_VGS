let iframeEl = document.querySelector('iframe');

function skalerIframe(){
    let iframeHøyde = iframeEl.getBoundingClientRect().height;
    console.log(iframeHøyde)
}


window.addEventListener("resize", skalerIframe());







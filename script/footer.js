fetch('/Fagvalgsider_Elvebakken_VGS/widgets/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });
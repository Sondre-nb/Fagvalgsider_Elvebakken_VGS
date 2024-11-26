document.addEventListener('DOMContentLoaded', () => {
    const cssEditor = document.getElementById('css-editor');
    const applyButton = document.getElementById('apply-css');

    applyButton.addEventListener('click', () => {
        const cssCode = cssEditor.value;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = cssCode;
        document.head.appendChild(styleSheet);
    });
});

let start_value = `
        /* Prøv å endre fonten */
        .tittel {
            font-family: 'Oslo Sans';
            font-size: 24px;
        }

        /* Prøv å endre fargene */
        button {
            background-color: lightgrey;
            color: black;
            padding: 10px 20px;
            margin: 4px;
        }
        /* Når musen er over knappen */ 
        button:hover {
            background-color: grey;
            color: white;
        }
    `;

document.getElementById('reset-css').addEventListener('click', () => {
    reset_css();
});

function reset_css() {
    document.querySelectorAll('style').forEach(style => style.remove());
    const styleSheet = document.createElement('style');
    styleSheet.textContent = start_value;
    document.head.appendChild(styleSheet);

    document.getElementById('css-editor').value = start_value;
}

window.onload = function() {
    reset_css();
}
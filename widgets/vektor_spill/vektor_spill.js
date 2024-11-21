// Trengs fordi det er et html-element som skal lastes inn i en iframe
document.getElementById('fullskjerm-link').addEventListener('click', function(event) {
    event.preventDefault();
    window.parent.location.href = this.href;
    fullscreen = true;  
});

// Skaffer referanse til canvas og kontekst
const canvas = document.getElementById('vektor-canvas');
const ctx = canvas.getContext('2d');

// Museposisjon
let offsetX, offsetY;

// Vektor som blir dratt
let draggingVector = null;

// Om vi skal vise verdier over vektorene og punktene
let showText = false;

let currentLevel = 0;
let levels = [
    {
        name: "Level 0",
        points: [[50, 250], [350, 50]], // De to punktene som vektorene skal gå til
        vectors: [{"pos": [250, 250], "value": [100, -150]}, // Vektorene med startposisjon og verdi
                    {"pos": [50, 100], "value": [200, -50]}],
    },
    {
        name: "Level 1",
        points: [[50, 250], [350, 50]],
        vectors: [{"pos": [250, 150], "value": [50, -100]}, 
                    {"pos": [150, 100], "value": [50, -50]}, 
                    {"pos": [50, 150], "value": [200, -50]}],
    },
    {
        name: "Level 2",
        points: [[90, 150], [330, 175]],
        vectors: [{"pos": [250, 150], "value": [50, -100]}, 
                    {"pos": [150, 100], "value": [70, 75]}, 
                    {"pos": [50, 150], "value": [120, 50]}],
    },
    {
        name: "Level 3",
        points: [[80, 275], [330, 75]],
        vectors: [
            {"pos": [250, 150], "value": [100, -100]}, 
            {"pos": [150, 100], "value": [50, 50]}, 
            {"pos": [50, 150], "value": [150, -50]}, 
            {"pos": [100, 200], "value": [-50, -100]}
        ],
    },
    {
        name: "Level 4",
        points: [[50, 50], [370, 270]],
        vectors: [
            {"pos": [250, 150], "value": [100, 70]}, 
            {"pos": [150, 100], "value": [65, 50]}, 
            {"pos": [50, 150], "value": [75, -20]}, 
            {"pos": [100, 200], "value": [30, 130]}, 
            {"pos": [200, 250], "value": [50, -10]}
        ],
    },
    {
        name: "Level 5",
        points: [[70, 150], [390, 180]],
        vectors: [{"pos": [300, 300], "value": [100, -100]}, 
                    {"pos": [300, 250], "value": [-70, -80]}, 
                    {"pos": [50, 250], "value": [100, -40]}, 
                    {"pos": [90, 100], "value": [60, 30]}, 
                    {"pos": [80, 120], "value": [-20, 30]}, 
                    {"pos": [240, 90], "value": [80, 110]}, 
                    {"pos": [50, 50], "value": [70, 80]}],
    }

];

// Level buttons
const level0Button = document.getElementById('level-0-knapp');
const level1Button = document.getElementById('level-1-knapp');
const level2Button = document.getElementById('level-2-knapp');
const level3Button = document.getElementById('level-3-knapp');
const level4Button = document.getElementById('level-4-knapp');
const level5Button = document.getElementById('level-5-knapp');

// Bare legg til eventlistener for level 0 da det er det eneste som er tilgjengelig i starten
level0Button.addEventListener('click', () => {
    currentLevel = 0;
    draggingVector = null;
});

// Viser eller skjuler verdier over vektorene og punktene
const visTekstKnapp = document.getElementById('toggle-tekst-knapp');
visTekstKnapp.addEventListener('click', () => {
    showText = !showText;
    visTekstKnapp.innerText = showText ? "Skjul verdier" : "Vis verdier";
});

// Hvorfor knapp
const hvorforKnapp = document.getElementById('hvorfor-knapp');
const modal = document.getElementById('hvorfor-modal');
const closeModal = document.getElementById('close-modal');

hvorforKnapp.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Eventlisteners for mus
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mouseup", onMouseUp);

// Eventlisteners for touch
canvas.addEventListener("touchstart", touchStart, { passive: false });
canvas.addEventListener("touchmove", touchMove, { passive: false });
canvas.addEventListener("touchend", touchEnd, { passive: false });

// Funksjoner for touch
function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    // Returnerer posisjonen til touchen relativt til canvaset
    return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
    };
}

function touchMove(e) {
    e.preventDefault();
    const { offsetX, offsetY } = getTouchPos(e);
    onMouseMove({ offsetX, offsetY });
}

function touchStart(e) {
    e.preventDefault();
    const { offsetX, offsetY } = getTouchPos(e);
    onMouseDown({ offsetX, offsetY });
}

function touchEnd(e) {
    e.preventDefault();
    onMouseUp();
}

// Funksjoner for mus
function onMouseMove(e) {
    const { offsetX, offsetY } = e;
    if (draggingVector) {
        // Flytt vektoren til museposisjonen om vi drar på en vektor
        draggingVector.pos[0] = offsetX;
        draggingVector.pos[1] = offsetY;
        draw();
    }
}

function onMouseDown(e) {
    const { offsetX, offsetY } = e;
    // Skjekk om vi trykker på en vektor
    for (let i = 0; i < levels[currentLevel].vectors.length; i++) {
        // Om vi trykker på en vektor, sett draggingVector til den vektoren
        if (isMouseOnVector(offsetX, offsetY, levels[currentLevel].vectors[i])) {
            draggingVector = levels[currentLevel].vectors[i];
            break;
        }
    }
}

function isMouseOnVector(mouseX, mouseY, vector) {
    const vectorStart = vector.pos;
    const vectorEnd = [vectorStart[0] + vector.value[0], vectorStart[1] + vector.value[1]];
    const distance = pointToLineDistance(mouseX, mouseY, vectorStart, vectorEnd);
    const threshold = 10;
    return distance < threshold;
}

function onMouseUp() {
    // Kan bare slippe vektoren om vi har en vektor vi drar på
    if (draggingVector === null) {
        return;
    }

    const vectorStart = draggingVector.pos;

    // Disse to variablene holder på informasjon om den nærmeste vektoren eller punktet, det nærmeste punktet er det vi skal koble til
    let closestPoint = null;
    let closestDistance = Infinity;
    
    // Sjekk om vi er nære et punkt
    for (let i = 0; i < levels[currentLevel].points.length; i++) {
        const point = levels[currentLevel].points[i];
        const distance = distanceBetweenPoints(vectorStart[0], vectorStart[1], point[0], point[1]);

        if (distance < 20 && distance < closestDistance) {
            closestPoint = point;
            closestDistance = distance;
        }
    }

    // Sjekk om vi er nære en annen vektors ende
    for (let i = 0; i < levels[currentLevel].vectors.length; i++) {
        const otherVector = levels[currentLevel].vectors[i];
        if (otherVector === draggingVector) {
            continue;
        }

        const otherVectorStart = otherVector.pos;
        const otherVectorEnd = [otherVectorStart[0] + otherVector.value[0], otherVectorStart[1] + otherVector.value[1]];

        const distance = distanceBetweenPoints(vectorStart[0], vectorStart[1], otherVectorEnd[0], otherVectorEnd[1]);
        if (distance < 20 && distance < closestDistance) {
            closestPoint = otherVectorEnd;
            closestDistance = distance;
        }
    }

    // Flytt vektoren til det nærmeste punktet
    if (closestPoint !== null) {
        draggingVector.pos[0] = closestPoint[0];
        draggingVector.pos[1] = closestPoint[1];
    }

    // Reset draggingVector
    draggingVector = null;

    // Sjekk om vi har løst levelen, altså om det går en linje fra et punkt til et annet
    checkIfLevelIsSolved();
}

// Hvor langt er et punkt fra en linje
function pointToLineDistance(x, y, start, end) {
    // Smarte matte greier
    // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    const A = x - start[0];
    const B = y - start[1];
    const C = end[0] - start[0];
    const D = end[1] - start[1];

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = (len_sq !== 0) ? dot / len_sq : -1;

    if (param < 0) param = 0;
    else if (param > 1) param = 1;

    const xx = start[0] + param * C;
    const yy = start[1] + param * D;

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

// Hvor langt er det mellom to punkter
function distanceBetweenPoints(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// Tegn start/slutt punkt og evt tekst
function drawPoint(point, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
    ctx.fill();

    drawText(`(${point[0]}, ${point[1]})`, point[0] + 10, point[1] - 10, color="black");
}

// Tegn vektor og evt tekst
function drawVector(vector) {
    const start = vector.pos;
    const end = [start[0] + vector.value[0], start[1] + vector.value[1]];

    // Gjør klar pennen
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    // Tegn vektoren
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);

    // Tegn pilhodet
    let angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
    let headlen = 10;
    ctx.moveTo(end[0], end[1]);
    ctx.lineTo(end[0] - headlen * Math.cos(angle - Math.PI / 5), end[1] - headlen * Math.sin(angle - Math.PI / 5));
    ctx.moveTo(end[0], end[1]);
    ctx.lineTo(end[0] - headlen * Math.cos(angle + Math.PI / 5), end[1] - headlen * Math.sin(angle + Math.PI / 5));
    
    // Tegn vektoren og pilhodet
    ctx.stroke();

    // Tegn tekst (skjer bare om showText er true   )
    const textX = start[0] + (end[0] - start[0]) / 2;
    const textY = start[1] + (end[1] - start[1]) / 2;
    drawText(`(${vector.value[0]}, ${vector.value[1]})`, textX, textY);
}

// Sjekk om levelen er løst, altså om du kan gå fra et punkt til et annet gjenom vektorene
function checkIfLevelIsSolved() {
    // Gå gjennom alle vektorene
    for (let i = 0; i < levels[currentLevel].vectors.length; i++) {
        const vector = levels[currentLevel].vectors[i];
        const start = vector.pos;
        const end = [start[0] + vector.value[0], start[1] + vector.value[1]];
        
        // Sjekk om startpunktet er et av punktene, i såfall skal vi sjekke om du kan følge vektorene til det andre punktet
        for (let j = 0; j < levels[currentLevel].points.length; j++) {
            const point = levels[currentLevel].points[j];
            // Sjekk om startpunktet er et av punktene
            if (start[0] === point[0] && start[1] === point[1]) {
                // Checknextvektor returnerer true om endepunktet er koblet til et punkt. Den kjører seg selv rekursivt for å sjekke om endepunktet er koblet til en annen vektor
                if (checkNextVector(end)) {
                    enableNextLevel();
                }
            }
        }
    }
}

// Sjekk om endepunktet er koblet til et punkt eller en annen vektor, 
// om det er koblet til en annen vektor kjører den seg selv rekursivt
// om det er koblet til et punkt returnerer den true.
function checkNextVector(end) {
    // Skjer om endepunktet er koblet til et punkt
    for (let j = 0; j < levels[currentLevel].points.length; j++) {
        const point = levels[currentLevel].points[j];
        if (end[0] === point[0] && end[1] === point[1]) {
            return true;
        }
    }

    // Skjer om endepunktet er koblet til en annen vektor
    for (let k = 0; k < levels[currentLevel].vectors.length; k++) {
        const otherVector = levels[currentLevel].vectors[k];
        const otherVectorStart = otherVector.pos;
        const otherVectorEnd = [otherVectorStart[0] + otherVector.value[0], otherVectorStart[1] + otherVector.value[1]];
        if (end[0] === otherVectorStart[0] && end[1] === otherVectorStart[1]) {
            return checkNextVector(otherVectorEnd);
        }
    }
} 

// Aktiver neste level, om det er en level etter
function enableNextLevel() {
    if (currentLevel == 0) {
        level1Button.classList.remove("disabled");
        level1Button.addEventListener('click', () => {
            currentLevel = 1;
            draggingVector = null;
        });
    } else if (currentLevel == 1) {
        level2Button.classList.remove("disabled");
        level2Button.addEventListener('click', () => {
            currentLevel = 2;
            draggingVector = null;
        });
    } else if (currentLevel == 2) {
        level3Button.classList.remove("disabled");
        level3Button.addEventListener('click', () => {
            currentLevel = 3;
            draggingVector = null;
        });
    } else if (currentLevel == 3) {
        level4Button.classList.remove("disabled");
        level4Button.addEventListener('click', () => {
            currentLevel = 4;
            draggingVector = null;
        });
    } else if (currentLevel == 4) {
        level5Button.classList.remove("disabled");
        level5Button.addEventListener('click', () => {
            currentLevel = 5;
            draggingVector = null;
        });
    } else if (currentLevel == 5) {
        hvorforKnapp.style.display = "block";
    }
}

// Tegn tekst om showText er true
function drawText(text, x, y, color="red") {
    if (!showText) {
        return;
    }
    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

// Tegn alt av vektorer og punkter
function draw() {
    // Tøm canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tegn alle vektorene
    for (let i = 0; i < levels[currentLevel].vectors.length; i++) {
        drawVector(levels[currentLevel].vectors[i]);
    }

    // Tegn start og endepunkt
    drawPoint(levels[currentLevel].points[0], "green");
    drawPoint(levels[currentLevel].points[1], "blue");
}

// Tegn canvas hver frame
setInterval(draw, 1000 / 60);
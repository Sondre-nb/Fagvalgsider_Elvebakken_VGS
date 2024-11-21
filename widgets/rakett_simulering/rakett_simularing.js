// Trengs fordi det er et html-element som skal lastes inn i en iframe
document.getElementById('fullskjerm-link').addEventListener('click', function(event) {
    event.preventDefault();
    window.parent.location.href = this.href;
    fullscreen = true;  
});

// Skaffer referanse til canvas og kontekst
const canvas = document.getElementById('vektor-canvas');
const ctx = canvas.getContext('2d');

// Rocket
let rocketLaunch = false;
const platformPos = { x: canvas.width - 100, y: canvas.height - 40 };
const platformWidth = 30;
const platformHeight = 10;

const rocketStartPos = { x: platformPos.x + platformWidth/3, y: platformPos.y - 30 };
const rocketPos = { x: rocketStartPos.x, y: rocketStartPos.y };

const rocketVector = { x: 0, y: 0 };
let rocketRotation = 0;

const gravityVector = { x: 0, y: 0.01 };

const motorA1 = {
    "vector": { x: -.02, y: -0.1 },
    burnTime: 400
}

// Buttons
document.getElementById("reset-rocket").addEventListener("click", function() {
    resetRocket();
});
document.getElementById("launch-rocket").addEventListener("click", function() {
    rocketLaunch = true;
});

function drawBackground() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'grey';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 100);

    ctx.fillStyle = 'darkgrey';
    ctx.fillRect(platformPos.x, platformPos.y, platformWidth, platformHeight);
}

function drawRocket(x, y, rotation) {
    const rocketBodyColor = 'red';
    const rocketFinnColor = 'orange';
    const rocketWidth = 10;
    const rocketHeight = 30;
    const coneHeight = 10;
    const finnWidth = 5;
    const finnPointyHeight = 15;

    // Save the current context state
    ctx.save();

    // Move the origin to the rocket's position
    ctx.translate(x, y);

    // Rotate the context
    ctx.rotate(rotation);

    // Move the origin back to the top-left corner of the rocket
    ctx.translate(-rocketWidth / 2, -rocketHeight / 2);

    // Rocket body
    ctx.fillStyle = rocketBodyColor;
    ctx.fillRect(-rocketWidth / 2, -rocketHeight / 2, rocketWidth, rocketHeight);

    // Rocket nose
    ctx.beginPath();
    ctx.moveTo(-rocketWidth / 2, -rocketHeight / 2);
    ctx.lineTo(0, -rocketHeight / 2 - coneHeight);
    ctx.lineTo(rocketWidth / 2, -rocketHeight / 2);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();

    // Rocket fins (left)
    ctx.beginPath();
    ctx.moveTo(-rocketWidth / 2 - finnWidth, rocketHeight / 2);
    ctx.lineTo(-rocketWidth / 2, rocketHeight / 2 - finnPointyHeight);
    ctx.lineTo(-rocketWidth / 2, rocketHeight / 2);
    ctx.closePath();
    ctx.fillStyle = rocketFinnColor;
    ctx.fill();

    // Rocket fins (right)
    ctx.beginPath();
    ctx.moveTo(rocketWidth / 2 + finnWidth, rocketHeight / 2);
    ctx.lineTo(rocketWidth / 2, rocketHeight / 2 - finnPointyHeight);
    ctx.lineTo(rocketWidth / 2, rocketHeight / 2);
    ctx.closePath();
    ctx.fillStyle = rocketFinnColor;
    ctx.fill();

    // Restore the context to its original state
    ctx.restore();
}
function resetRocket() {
    rocketPos.x = rocketStartPos.x;
    rocketPos.y = rocketStartPos.y;
    rocketVector.x = 0;
    rocketVector.y = 0;
    rocketLaunch = false;
    motorA1.burnTime = 400;
}

function getRotation(vector) {
    return Math.atan2(vector.y, vector.x)+Math.PI/2;
}

function applyForceToRocket(vector) {
    rocketVector.x += vector.x;
    rocketVector.y += vector.y;
}

function applyGravityToRocket() {
    applyForceToRocket(gravityVector);
}

function moveRocket() {
    rocketPos.x += rocketVector.x;
    rocketPos.y += rocketVector.y;
}

function launchRocket() {
    resetRocket();
    rocketLaunch = true;
}

// Tegn alt 
function draw() {
    // Tøm canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tegn bakgrunn
    drawBackground();

    // Oppdater rakettens rotasjon
    rocketRotation = getRotation(rocketVector);

    // Tegn rakett
    drawRocket(rocketPos.x, rocketPos.y, rocketRotation);

    if (rocketLaunch) {
        // Apply engine force
        if (motorA1.burnTime > 0) {
            applyForceToRocket(motorA1.vector);
            motorA1.burnTime -= 1000 / 60;
        }

        moveRocket();
        applyGravityToRocket();
    }
}

// Tegn canvas hver frame
setInterval(draw, 1000 / 60);
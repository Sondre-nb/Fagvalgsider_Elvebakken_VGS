// Trengs fordi det er et html-element som skal lastes inn i en iframe
document.getElementById('fullskjerm-link').addEventListener('click', function(event) {
    event.preventDefault();
    window.parent.location.href = this.href;
    fullscreen = true;  
});

document.getElementById('toggle-advanced-settings').addEventListener('change', function() {
    const advancedSettings = document.getElementById('advanced-settings');
    if (this.checked) {
        advancedSettings.style.display = 'block';
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        advancedSettings.style.display = 'none';
    }
});

const angleInput = document.getElementById('launch-angle');
const angleValue = document.getElementById('angle-value');
const thrustInput = document.getElementById('thrust');
const thrustValue = document.getElementById('thrust-value');
const massInput = document.getElementById('mass');
const massValue = document.getElementById('mass-value');
const burnTimeInput = document.getElementById('burn-time');
const burnTimeValue = document.getElementById('burn-time-value');

angleInput.addEventListener('input', function() {
    angleValue.textContent = angleInput.value;
    resetRocket();
});

thrustInput.addEventListener('input', function() {
    if (parseFloat(thrustInput.value) > 1000) {
        thrustValue.textContent = Math.round(parseFloat(thrustInput.value)/1000) + ' kN';
    }
    else {
        thrustValue.textContent = thrustInput.value + ' N';
    }
    resetRocket();
});

massInput.addEventListener('input', function() {
    massValue.textContent = massInput.value;
    resetRocket();
});

burnTimeInput.addEventListener('input', function() {
    burnTimeValue.textContent = burnTimeInput.value + ' s';
    resetRocket();
});

const noseColorInput = document.getElementById('nose-color');
const finsColorInput = document.getElementById('fins-color');
const bodyColorInput = document.getElementById('body-color');

class Rocket {
    constructor(pos) {
        this.pos = pos.clone(); // m
        this.vel = new Vek2(0, 0); // m/s
        this.acc = new Vek2(0, 0); // m/s^2
        this.mass = parseFloat(massInput.value); // kg
        this.k_L = 0.01; // luftmotstandskoeffisienten
        this.launch_angle = angleInput.value / 180 * Math.PI; // rad
        this.motor = {
            vector: new Vek2(0, 0),
            thrust: parseFloat(thrustInput.value), // N
            burnTime: parseFloat(burnTimeInput.value) // s
        };
    }

    // dt: delta time
    update(dt) {
        this.vel.addV(Vek2.multN(this.acc, dt));
        this.pos.addV(Vek2.multN(this.vel, dt));
        this.acc.set(0, 0);
    }

    // f: newton
    applyForce(f) {
        this.acc.addV(Vek2.divN(f, this.mass));
    }
}


// Skaffer referanse til canvas og kontekst
const canvas = document.getElementById('vektor-canvas');
const ctx = canvas.getContext('2d');

// Rocket
let rocketLaunch = false;
const platformPos = new Vek2(20, canvas.height - 40);
const platformWidth = 30;
const platformHeight = 10;

const rocketStartPos = new Vek2(platformPos.x + platformWidth/2, platformPos.y - 10);
let rocket = new Rocket(rocketStartPos);

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
    const rocketBodyColor = bodyColorInput.value;
    const rocketFinnColor = finsColorInput.value;
    const rocketNoseColor = noseColorInput.value;
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
    ctx.fillStyle = rocketNoseColor;
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

    // Rocket engine
    if (rocketLaunch == false) {
        ctx.fillStyle = 'black';
        ctx.fillRect(-2, rocketHeight / 2, 4, 5);
    }
    else if (rocket.motor.burnTime > 0) {
        ctx.fillStyle = 'orange';
        ctx.fillRect(-2, rocketHeight / 2, 4, 3);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(-2, rocketHeight / 2 + 3, 4, 2);
    }
    // Restore the context to its original state
    ctx.restore();
}

function resetRocket() {
    rocket = new Rocket(rocketStartPos);
    rocketLaunch = false;
    rocket.motor.burnTime  = parseFloat(burnTimeInput.value);
}

function getRotation(vector) {
    return vector.rotation()+Math.PI/2;
}

function launchRocket() {
    resetRocket();
    rocketLaunch = true;
}

let lastDrawTime; // ms

// Tegn alt 
function draw() {
    // Regn ut tiden som har gått siden forrige draw
    const now = performance.now(); // ms
    const deltaTime = (now - lastDrawTime) / 1000; // s
    lastDrawTime = now;

    // Tøm canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tegn bakgrunn
    drawBackground();

    if (rocketLaunch) {
        // Apply engine force
        if (rocket.motor.burnTime > 0) {
            rocket.motor.vector = new Vek2(0, rocket.motor.thrust);
            
            rocket.motor.vector.rotate(rocket.launch_angle+Math.PI);

            rocket.applyForce(rocket.motor.vector);

            rocket.motor.burnTime -= deltaTime;
        }

        const airResistance = Vek2.normalized(rocket.vel).multN(rocket.vel.lenSq() * rocket.k_L).negate();
        rocket.applyForce(airResistance);
        
        const gravity = new Vek2(0, 9.81).multN(rocket.mass);
        rocket.applyForce(gravity, deltaTime);
        
        rocket.update(deltaTime);
    }

    // Oppdater rakettens rotasjon
    if (rocketLaunch === false) {
        rocketRotation = rocket.launch_angle;
    }
    else {
        rocketRotation = getRotation(rocket.vel);
    }

    // Tegn rakett
    drawRocket(rocket.pos.x, rocket.pos.y, rocketRotation);
}

lastDrawTime = performance.now();
// Tegn canvas hver frame
setInterval(draw, 1000 / 60);
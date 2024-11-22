// Trengs fordi det er et html-element som skal lastes inn i en iframe
document.getElementById('fullskjerm-link').addEventListener('click', function(event) {
    event.preventDefault();
    window.parent.location.href = this.href;
    fullscreen = true;  
});

class Rocket {
    constructor(pos) {
        this.pos = pos.clone(); // m
        this.vel = new Vek2(0, 0); // m/s
        this.acc = new Vek2(0, 0); // m/s^2
        this.mass = 1000; // kg
        this.k_L = 0.01; // luftmotstandskoeffisienten
        this.motorA1 = {
            vector: new Vek2(-50000, -150000), // N
            burnTime: 0.4 // s
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
const platformPos = new Vek2(canvas.width - 100, canvas.height - 40);
const platformWidth = 30;
const platformHeight = 10;

const rocketStartPos = new Vek2(platformPos.x + platformWidth/3, platformPos.y - 30);
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

    // function circle(pos, radius) {
    //     const x = pos.x;
    //     const y = pos.y;
    //     ctx.beginPath();
    //     ctx.arc(x, y, radius, 0, 2*Math.PI);
    //     ctx.fill();
    // }
    // ctx.fillStyle = "red";
    // circle(rocket.pos, 5);

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
    rocket = new Rocket(rocketStartPos);
    rocketLaunch = false;
    rocket.motorA1.burnTime = 0.4;
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

    // Oppdater rakettens rotasjon
    rocketRotation = getRotation(rocket.vel);

    // Tegn rakett
    drawRocket(rocket.pos.x, rocket.pos.y, rocketRotation);

    if (rocketLaunch) {
        // Apply engine force
        if (rocket.motorA1.burnTime > 0) {
            rocket.applyForce(rocket.motorA1.vector);
            rocket.motorA1.burnTime -= deltaTime;
        }

        const airResistance = Vek2.normalized(rocket.vel).multN(rocket.vel.lenSq() * rocket.k_L).negate();
        rocket.applyForce(airResistance);
        
        const gravity = new Vek2(0, 9.81).multN(rocket.mass);
        rocket.applyForce(gravity, deltaTime);
        
        rocket.update(deltaTime);
    }
}

lastDrawTime = performance.now();
// Tegn canvas hver frame
setInterval(draw, 1000 / 60);
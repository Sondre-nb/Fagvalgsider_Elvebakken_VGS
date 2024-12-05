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

class Node {
    constructor(pos, mass) {
        this.pos = pos.clone(); // m
        this.lastPos = this.pos.clone(); // m/s
        this.acc = new Vek2(0, 0); // m/s^2
        this.mass = mass; // kg
    }

    // dt: delta time
    update(dt) {
        const vel = Vek2.subV(this.pos, this.lastPos);
        this.lastPos.set(this.pos);
        this.pos = Vek2.addV(this.pos, Vek2.addV(vel, Vek2.multN(this.acc, dt*dt)));
        this.acc.set(0, 0);
    }

    // f: newton
    applyForce(f) {
        this.acc.addV(Vek2.divN(f, this.mass));
    }

    vel() {
        return Vek2.subV(this.pos, this.lastPos);
    }

    // Beveger node uten å påvirke hasigheten
    move(offset) {
        this.pos.addV(offset);
        this.lastPos.addV(offset);
    }

    // Beveger node uten å påvirke hasigheten
    setPos(pos) {
        const v = this.vel();
        this.pos.set(pos);
        this.lastPos.set(pos).subV(v);
    }
}

class Rocket {
    constructor(pos) {
        this.height = 50;
        const totalMass = parseFloat(massInput.value);
        this.nodes = [
            new Node(Vek2.sub(pos, new Vek2(0, this.height)), totalMass/2), // tip
            new Node(pos, totalMass/2), // tail

        ]
        this.k_L = 0.01; // luftmotstandskoeffisienten
        this.motor = {
            thrust: parseFloat(thrustInput.value), // N
            burnTime: parseFloat(burnTimeInput.value) // s
        };

        this.parachuteDeployed = false;
        this.parachute_k_L = 40000; // luftmotstandskoeffisienten
    }

    // dt: delta time
    update(dt) {
        // Motorens kraft
        if (this.motor.burnTime > 0) {
            const motorForce = this.dirVec().multN(this.motor.thrust);
            this.applyForce(motorForce);

            this.motor.burnTime -= dt;
        }

        // Fallskjerm
        if(this.parachuteDeployed) {
            const vel = this.tip().vel();
            const forceMagnitude = this.parachute_k_L * vel.lenSq();
            const forceDirection = Vek2.normalized(vel).negate();
            this.tip().applyForce(forceDirection.multN(forceMagnitude));
        }

        // Rakettens luftmotstand
        const airResistance = Vek2.normalized(this.vel()).multN(this.vel().lenSq() * this.k_L).negate(); // L = k * v^2
        this.applyForce(airResistance);

        // Tyngdekraft
        const gravity = new Vek2(0, 9.81).multN(this.mass());
        this.applyForce(gravity);

        // Hold avstanden mellom tip og tail konstant
        const o1 = this.tip();
        const o2 = this.bottom();
        let axis = Vek2.subV(o1.pos, o2.pos);
        let dist = axis.len();
        axis.normalize();
        let delta = this.height - dist;
        o1.pos.addV(Vek2.multN(axis,  0.5 * delta));
        o2.pos.addV(Vek2.multN(axis, -0.5 * delta));

        for(const node of this.nodes) {
            node.update(dt);
        }
    }

    mass() {
        let m = 0;
        for(const node of this.nodes) {
            m += node.mass;
        }
        return m;
    }

    // f: newton
    applyForce(f) {
        for(const node of this.nodes) {
            node.applyForce(f);
        }
    }

    pos() {
        return Vek2.addV(this.tip().pos, this.bottom().pos).div(2);
    }

    // følger enhetsirkelen
    dir() {
        return this.dirVec().rotation();
    }

    // følger enhetsirkelen
    dirVec() {
        return Vek2.subV(this.tip().pos, this.bottom().pos).normalize();
    }

    // gjennomsnittlig hastighet
    vel() {
        let v = new Vek2();
        for(const node of this.nodes) {
            v.addV(node.vel());
        }
        v.divN(this.nodes.length);
        return v;
    }

    tip() {
        return this.nodes[0];
    }

    bottom() {
        return this.nodes[1];
    }
}


// Skaffer referanse til canvas og kontekst
const canvas = document.getElementById('vektor-canvas');
const ctx = canvas.getContext('2d');
const cameraScale = 0.7;
const cameraTranslation = new Vek2();

// Rocket
let rocketLaunch = false;
const platformPos = new Vek2(0, 0);
const platformWidth = 75;
const platformHeight = 30;

const rocketStartPos = new Vek2(platformPos.x + platformWidth/2, platformPos.y-2);
let rocket = new Rocket(rocketStartPos);

// Buttons
document.getElementById("reset-rocket").addEventListener("click", function() {
    resetRocket();
});
document.getElementById("launch-rocket").addEventListener("click", function() {
    rocketLaunch = true;
});

document.getElementById("deploy-parachute").addEventListener("click", function() {
    if(rocketLaunch){
        rocket.parachuteDeployed = true;
    }
});

function drawSky() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix

    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
}

function drawGround() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(-2000, 30, 4000, 2000);

    ctx.fillStyle = 'darkgrey';
    ctx.fillRect(platformPos.x, platformPos.y, platformWidth, platformHeight);
}

function drawRocket(x, y, rotation) {
    rotation += Math.PI/2;
    const rocketBodyColor = bodyColorInput.value;
    const rocketFinnColor = finsColorInput.value;
    const rocketNoseColor = noseColorInput.value;
    const rocketWidth = 10;
    const rocketHeight = rocket.height;
    const coneHeight = 10;
    const finnWidth = 8;
    const finnPointyHeight = 20;

    // Save the current context state
    ctx.save();

    // Move the origin to the rocket's position
    ctx.translate(x, y);

    // Rotate the context
    ctx.rotate(rotation);

    // Rocket body
    ctx.fillStyle = rocketBodyColor;
    ctx.fillRect(-rocketWidth / 2, -rocketHeight / 2 + coneHeight, rocketWidth, rocketHeight-coneHeight);

    // Rocket nose
    ctx.beginPath();
    ctx.moveTo(-rocketWidth / 2, -rocketHeight / 2 + coneHeight);
    ctx.lineTo(0, -rocketHeight / 2);
    ctx.lineTo(rocketWidth / 2, -rocketHeight / 2 + coneHeight);
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

    // Draw parachute
    if(rocket.parachuteDeployed) {

        ctx.save();
        ctx.translate(rocket.tip().pos.x, rocket.tip().pos.y);
        const parachuteDir = rocket.tip().vel().normalize();
        ctx.rotate(parachuteDir.rotation()- Math.PI/2);
        const parachuteLength = 50;
        const parachuteRadius = 40;
        ctx.fillStyle = "red";
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(0, -parachuteLength, parachuteRadius, Math.PI, 0);
        ctx.fill();

        // Left cord
        ctx.beginPath();
        ctx.moveTo(-parachuteRadius, -parachuteLength);
        ctx.lineTo(0, 0);
        ctx.stroke();

        // Right cord
        ctx.beginPath();
        ctx.moveTo(parachuteRadius, -parachuteLength);
        ctx.lineTo(0, 0);
        ctx.stroke();

        ctx.restore();
    }
}

function drawRocketHeight() {
    let unit = "m";
    let height = Math.round((rocket.pos().y*-1)-rocket.height/4);

    if (height > 1000) {
        height = Math.round(height/1000);
        unit = "km";
    }

    ctx.fillText('Høyde: ' + height + unit, 5, 19);
}

function drawMotorBurnTime() {
    if (rocket.motor.burnTime.toFixed(2) <= 0.00) {
        ctx.fillText('Motor: Av', 5, 39);
    }
    else {
        ctx.fillText('Motor: På (' + rocket.motor.burnTime.toFixed(2) + ' s)', 5, 39);
    }
}

function drawHUD() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix

    ctx.fillStyle = 'black';
    ctx.font = '14px "Roboto Mono"';
    drawRocketHeight();
    drawMotorBurnTime();

    ctx.restore();
}

resetRocket();

function resetRocket() {
    rocket = new Rocket(rocketStartPos);
    rocketLaunch = false;
    rocket.motor.burnTime  = parseFloat(burnTimeInput.value);
    const rotationDeg = parseFloat(angleValue.textContent);
    const rotationRad = (rotationDeg / 180) * Math.PI;
    rocket.tip().setPos(Vek2.rotate(rocket.tip().pos, rocket.bottom().pos, rotationRad));
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

    cameraTranslation.set(rocket.tip().pos.clone().negate().add(new Vek2(canvas.width, canvas.height).div(2).div(cameraScale)).mult(cameraScale));

    ctx.reset();
    // Tøm canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(cameraTranslation.x, cameraTranslation.y);
    ctx.scale(cameraScale, cameraScale);

    // Tegn bakgrunn
    drawSky();
    drawGround();

    if (rocketLaunch) {
        // Jukser litt med å få tiden til å gå dobbelt så fort her
        rocket.update(deltaTime);
        rocket.update(deltaTime);
    }

    // Tegn rakett
    drawRocket(rocket.pos().x, rocket.pos().y, rocket.dir());

    drawHUD();
}

lastDrawTime = performance.now();
// Tegn canvas hver frame
setInterval(draw, 1000 / 60);
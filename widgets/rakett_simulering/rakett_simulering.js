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
const zoomInput = document.getElementById('zoom');
const zoomValue = document.getElementById('zoom-value');


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

zoomInput.addEventListener('input', function() {
    zoomValue.textContent = zoomInput.value;
    cameraScale = parseFloat(zoomInput.value);
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

        // Cache
        this.prevDt = 1;
    }

    // dt: delta time
    update(dt) {
        const displacement = Vek2.sub(this.pos, this.lastPos);
        this.lastPos.set(this.pos);
        this.pos.add(Vek2.add(displacement, Vek2.multN(this.acc, dt*dt)));
        this.acc.set(0, 0);

        this.prevDt = dt;
    }

    // f: newton
    applyForce(f) {
        this.acc.add(Vek2.div(f, this.mass));
    }

    vel() {
        return Vek2.sub(this.pos, this.lastPos).div(this.prevDt);
    }

    // Beveger node uten å påvirke hasigheten
    move(offset) {
        this.pos.add(offset);
        this.lastPos.add(offset);
    }

    // Beveger node uten å påvirke hasigheten
    setPos(pos) {
        const v = this.vel();
        this.pos.set(pos);
        this.lastPos.set(pos).sub(v);
    }
}

class Rocket {
    constructor(pos) {
        this.height = 50;
        this.width = 10;
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
        this.parachute_k_L = 10; // luftmotstandskoeffisienten
        this.fin_k_L = 0.7; // luftmotstandskoeffisienten

        // State
        this.crashed = false;
        this.landed = false;
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

        this.applyAirResistance();

        // Tyngdekraft
        var gravity = new Vek2(0, 9.81).multN(rocket.mass());
        this.applyForce(gravity);

        // Hold avstanden mellom tip og tail konstant
        const o1 = this.tip();
        const o2 = this.bottom();
        let axis = Vek2.sub(o1.pos, o2.pos);
        let dist = axis.len();
        axis.normalize();
        let delta = this.height - dist;
        o1.pos.add(Vek2.multN(axis,  0.5 * delta));
        o2.pos.add(Vek2.multN(axis, -0.5 * delta));

        for(const node of this.nodes) {
            node.update(dt);
        }
    }

    applyAirResistance() {
        // Rakettkroppens luftmotstand:
        // Bruker denne formelen: Fd = 1/2 * ρ * v^2 * Cd * A https://snl.no/luftmotstand
        const rho = airDensity(-this.pos().y); // -y siden alt er opp ned
        const v = this.vel().len();
        const Cd = this.k_L;
        // For å regne areal forenkles raketten til et rektangel.
        // Illustrasjon:
        // |--T--T2
        // |     |
        // |     |
        // |     |
        // |     |
        // |     |
        // B3-B--B2
        const T = this.tip().pos.clone();
        const B = this.bottom().pos.clone();
        const velocityAngle = this.vel().normalize().rotation();

        // For å finne overflatearealet relativt til fartsretningen roteres T og B rundt sentrum
        T.rotate(this.pos(), -velocityAngle + Math.PI/2);
        B.rotate(this.pos(), -velocityAngle + Math.PI/2);

        const T2 = Vek2.add(T, Vek2.sub(T, B).setMag(this.width/2).rotate(-Math.PI/2));
        const B2 = Vek2.add(B, Vek2.sub(B, T).setMag(this.width/2).rotate(Math.PI/2));
        const B3 = Vek2.add(B, Vek2.sub(B, T).setMag(this.width/2).rotate(-Math.PI/2));
        const s1 = Math.abs(T2.x-B2.x);
        const s2 = Math.abs(B2.x-B3.x);

        const A = s1 + s2;
        const airResistance = Vek2.normalized(this.vel()).negate().multN(0.5 * rho * v*v * Cd * A);
        this.applyForce(airResistance);
        console.log(airResistance);

        // Finnenes luftmotstand:
        const finAirResistance = Vek2.normalized(this.bottom().vel()).multN(this.bottom().vel().lenSq() * this.fin_k_L).negate();
        this.bottom().applyForce(finAirResistance);
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
        return Vek2.add(this.tip().pos, this.bottom().pos).div(2);
    }

    // følger enhetsirkelen
    dir() {
        return this.dirVec().rotation();
    }

    // følger enhetsirkelen
    dirVec() {
        return Vek2.sub(this.tip().pos, this.bottom().pos).normalize();
    }

    // gjennomsnittlig hastighet
    vel() {
        let v = new Vek2();
        for(const node of this.nodes) {
            v.add(node.vel());
        }
        v.div(this.nodes.length);
        return v;
    }

    tip() {
        return this.nodes[0];
    }

    bottom() {
        return this.nodes[1];
    }

    should_crash() {
        if (!this.is_on_ground()) {
            return false;
        }

        if (this.vel().y > 50) {
            return true;
        }

    }

    is_on_ground() {
        if ((this.tip().pos.y*-1 <= 0) || (this.bottom().pos.y*-1 <= 0)) {
            return true;
        }
        else if (this.pos().x < 75 && this.pos().x > 0) {
            return ((this.tip().pos.y*-1 <= 30) || (this.bottom().pos.y*-1 <= 30));
        }
    }
}

function airDensity(altitude) {
    return 1.225 * Math.exp(-altitude / 8400);
}


// Skaffer referanse til canvas og kontekst
const canvas = document.getElementById('vektor-canvas');
const ctx = canvas.getContext('2d');
var cameraScale = 0.7;
const cameraTranslation = new Vek2();

// Rocket
let rocketLaunch = false;
const platformPos = new Vek2(0, -30);
const platformWidth = 75;
const platformHeight = 30;

const rocketStartPos = new Vek2(platformPos.x + platformWidth/2, platformPos.y-2);
let rocket = new Rocket(rocketStartPos);

// Clouds
const clouds = [];

for (let i = 0; i < 1000; i++) {
    clouds.push({
        x: Math.random() * 40000 - 20000,
        y: ((Math.random() * 11000) + 2000) *-1,
        scale: Math.random() * 0.5 + 0.5
    });
}

// Stars
const stars = [];
for (let i = 0; i < 10000; i++) {
    stars.push({
        x: Math.random() * 40000 - 20000,
        y: ((Math.random() * 150000) + 100000) * -1,
        size: Math.random() * 2 + 1
    });
}

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

function drawCloud(x, y, scale) {
    ctx.fillStyle = 'white';

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.arc(0, 0, 20, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(30, 0, 30, Math.PI * 1, Math.PI * 1.85);
    ctx.arc(70, 0, 20, Math.PI * 1.37, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawStar(x, y, size) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

function drawSky() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix

    if (Math.round((rocket.pos().y*-1) > 100000)) {
        // Draw space
        ctx.fillStyle = '#1c1e2b';
    }
    else {
        ctx.fillStyle = 'lightblue';
    }

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw clouds
    for (let cloud of clouds) {
        drawCloud(cloud.x, cloud.y, cloud.scale);
    }

    // Draw stars
    for (let star of stars) {
        drawStar(star.x, star.y, star.size);
    }
}

function drawGround() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(-200000, 0, 400000, 4000);

    ctx.fillStyle = 'darkgrey';
    ctx.fillRect(platformPos.x, platformPos.y, platformWidth, platformHeight);
}

function drawRocket(x, y, rotation) {
    rotation += Math.PI/2;
    const rocketBodyColor = bodyColorInput.value;
    const rocketFinnColor = finsColorInput.value;
    const rocketNoseColor = noseColorInput.value;
    const rocketWidth = rocket.width;
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

function drawRocketHeight(x, y) {
    let unit = "m";
    let height = Math.round((rocket.pos().y*-1));

    if (height > 1000) {
        height = Math.round(height/1000);
        unit = "km";
    }

    ctx.fillText('Høyde: ' + height + unit, x, y);
}

function drawMotorBurnTime(x, y) {
    if (rocket.motor.burnTime.toFixed(2) <= 0.00) {
        ctx.fillText('Motor: Av', x, y);
    }
    else {
        ctx.fillText('Motor: På (' + rocket.motor.burnTime.toFixed(2) + ' s)', x, y);
    }
}

function drawRocketVelocity(x, y) {
    let x_unit = "m/s";
    let y_unit = "m/s";
    let velocity_x = Math.round(rocket.vel().x);
    let velocity_y = Math.round(rocket.vel().y);

    if (velocity_x > 1000) {
        velocity_x = Math.round(velocity_x/1000);
        x_unit = "km/s";
    }

    if (velocity_y > 1000) {
        velocity_y = Math.round(velocity_y/1000);
        y_unit = "km/s";
    }

    if (rocket.vel().x > 0) {
        direction_icon_x = "→";
    }
    else {
        direction_icon_x = "←";
    }

    if (rocket.vel().y < 0) {
        direction_icon_y = "↑";
    }
    else {
        direction_icon_y = "↓";
    }

    ctx.fillText('Fart: ' + Math.abs(velocity_x) + x_unit + " " + direction_icon_x + " | " + Math.abs(velocity_y) + y_unit + " " + direction_icon_y, x, y);
}

function drawRocketState(x, y) {
    if (rocket.crashed) {
        ctx.fillText('Status: Krasjet🧨', x, y);
    }
    else if (rocket.landed) {
        ctx.fillText('Status: Landet🎉', x, y);
    }
    else if (rocketLaunch) {
        ctx.fillText('Status: Skytes🚀', x, y);
    }
    else {
        ctx.fillText('Status: Venter⏸️', x, y);
    }
}

function drawHUD() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix

    if (Math.round((rocket.pos().y*-1) > 100000)) {
        ctx.fillStyle = 'white';
    }
    else {
        ctx.fillStyle = 'black';
    }
    ctx.font = '14px "Roboto Mono"';
    drawRocketHeight(5, 19);
    drawRocketVelocity(5, 39);
    drawMotorBurnTime(5, 59);
    drawRocketState(5, 79);

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
    gravity = new Vek2(0, 9.81).multN(rocket.mass());
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
    let deltaTime = (now - lastDrawTime) / 1000; // s
    lastDrawTime = now;
    // For at fysikken ikke skal gjøre for store hopp etter for eksempel bytting av fane.
    // Fysikken blir på en måte satt på pause.
    deltaTime = Math.min(deltaTime, 1/20);

    if (rocketLaunch) {
        if (rocket.should_crash()) {
            rocket.crashed = true;
        }
        else if (rocket.is_on_ground() && !rocket.crashed) {
            rocket.landed = true;
        }
        else {
            rocket.update(deltaTime);
        }
    }

    cameraTranslation.set(rocket.tip().pos.clone().negate().add(new Vek2(canvas.width, canvas.height).div(2).div(cameraScale)).mult(cameraScale));

    ctx.reset();
    // Tøm canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(cameraTranslation.x, cameraTranslation.y);
    ctx.scale(cameraScale, cameraScale);

    // Tegn bakgrunn
    drawSky();
    drawGround();

    // Tegn rakett
    drawRocket(rocket.pos().x, rocket.pos().y, rocket.dir());

    drawHUD();

    window.requestAnimationFrame(draw);
}

lastDrawTime = performance.now();
// Tegn canvas hver frame
draw();
// setInterval(draw, 1000 / 60);
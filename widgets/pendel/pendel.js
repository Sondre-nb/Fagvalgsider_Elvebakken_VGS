const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

// Pendel verdier
const rodLength = 200;
const centerX = canvas.width / 2;
const centerY = 100;
let rotationAngle = 0; // starts rotasjonsvinkel
let rotationDirection = 1; // 1 for å følge klokken, -1 for å følge motsatt klokken
let rotationSpeed = 0; // start farten - den starter med å stå stille
let maxRotationSpeed = 3;
let greenArrowLength = 65;
let switchValue = 0;
let testResult = "false"
let blueArrowMinusValue = 0; 

// Pendel masse
const massRadius = 15;

function drawPendulum() {
  // Tøm lerretet
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Oppdater rotasjonsvinkelen
  rotationAngle += rotationDirection * rotationSpeed; // Juster rotatsjon fra retning (1 eller -1)

  // Beregn posisjonen av pendel massen
  const pendulumX = centerX + rodLength * Math.cos((rotationAngle * Math.PI) / 180);
  const pendulumY = centerY + rodLength * Math.sin((rotationAngle * Math.PI) / 180);
    

  // Tegn gravitasjonskraftens pil
  const gravityArrowX = pendulumX; // Pilen starter ved enden av pendelen
  const gravityArrowY = pendulumY + massRadius; // Posisjoner pilen rett under pendel massen
  const gravityArrowLength = 56;

  // Calculate the position of the variable following the rotation
  let blueArrowPositionX = centerX + (rodLength - blueArrowMinusValue) * Math.cos((rotationAngle * Math.PI) / 180);
  let blueArrowPositionY = centerY + (rodLength - blueArrowMinusValue) * Math.sin((rotationAngle * Math.PI) / 180);


  // Beregn posisjonen til pil hodet
  const arrowheadLength = 14; // pil hodet sin lengde på blå pil

  // Beregn vinkelen for pil hodet linjene
  const arrowheadAngle = (rotationAngle * Math.PI) / 180;

  // Beregn koordinatene for pil hodet til den blåe pilen
  const blueArrowHeadX1 = blueArrowPositionX + arrowheadLength * Math.cos(arrowheadAngle);
  const blueArrowHeadY1 = blueArrowPositionY + arrowheadLength * Math.sin(arrowheadAngle);

  const blueArrowHeadX2 = blueArrowPositionX + arrowheadLength * Math.cos(arrowheadAngle + Math.PI / 9); // Right side
  const blueArrowHeadY2 = blueArrowPositionY + arrowheadLength * Math.sin(arrowheadAngle + Math.PI / 9);

  const blueArrowHeadX3 = blueArrowPositionX + arrowheadLength * Math.cos(arrowheadAngle - Math.PI / 9); // Left side
  const blueArrowHeadY3 = blueArrowPositionY + arrowheadLength * Math.sin(arrowheadAngle - Math.PI / 9);


  // Beregn sluttpunktet for den grønne pilen basert på pendelens posisjon og rotasjonsvinkel
  const offsetAngle = (rotationAngle - 90) * (Math.PI / 180); // Forskyv vinkelen til den grønne pilen med -90 grader

  const greenArrowEndpointX = pendulumX + greenArrowLength * Math.cos(offsetAngle + (180 * Math.PI) / 180);
  const greenArrowEndpointY = pendulumY + greenArrowLength * Math.sin(offsetAngle + (180 * Math.PI) / 180);

  // Beregn vinkelen for pil hodet linjene på den grønne pilen
  const greenArrowheadAngle1 = offsetAngle + Math.PI - Math.PI / 9; // kraftvektor justert vinkel
  const greenArrowheadAngle2 = offsetAngle + Math.PI + Math.PI / 9; // Kraftvektor justert vinkel

  if (switchValue === 0) {
    if (rotationAngle <= 90) {
      greenArrowLength -= 1;
    } else if (rotationAngle < 179 && rotationAngle > 90 && switchValue === 0) {
      greenArrowLength -= 1;
    } else if (rotationAngle > 179) {
      switchValue = 1;
    } 
    if (rotationAngle >= 90) {
      greenArrowLength -= 0.5;
    } 
  } 
  if (rotationAngle > 88 && rotationAngle < 90 && switchValue === 0) {
    greenArrowLength = 0;
  }
  if (switchValue === 1) {
    
    if (rotationAngle < 90) {
      greenArrowLength += 1.6;              
    } else if (rotationAngle > 90) {
      greenArrowLength += 1.2;
    } 
  if (rotationAngle > 88 && rotationAngle < 90 && switchValue === 1) {
      greenArrowLength = 0;
      blueArrowMinusValue = 81;
    }
  if (rotationAngle < 2 && switchValue === 1) {
    switchValue = 0;
    blueArrowMinusValue = 0;
  }
  }

  if (rotationAngle < 90 && switchValue === 0) {
    blueArrowMinusValue += 1.35;
  }  else if (rotationAngle > 90 && rotationAngle < 178 && switchValue === 0) {
    blueArrowMinusValue -= 1.8;
  } else if (rotationAngle > 179) {
    blueArrowMinusValue = 0;
  } else if (rotationAngle > 91 && switchValue === 1) {
    blueArrowMinusValue += 1.4;
  } else if (rotationAngle < 88 && rotationAngle > 2) {
    blueArrowMinusValue -= 1.7;
  } else if (rotationAngle < 91 && rotationAngle > 89 && blueArrowMinusValue != gravityArrowLength) {
    blueArrowMinusValue = gravityArrowLength;
  }
  
 
  // Bytt retning hvis linje når 180 grader eller 0 grader
  if (rotationAngle >= 180 || rotationAngle <= 0) {
    rotationDirection *= -1;
  }
  if (rotationAngle < 90 && rotationDirection < 0) {
    // Gradvis skru farten ned når pendelen beveger seg oppover før 90 grader
    rotationSpeed -= 0.05;
  } else if (rotationAngle >= 90 && rotationDirection < 0) {
    // Gradvis skru farten opp når pendelen beveger seg oppover etter 90 grader
    rotationSpeed += 0.05;
    if (rotationSpeed > maxRotationSpeed) {
      rotationSpeed = maxRotationSpeed;
    }
  } else if (rotationAngle >= 90 && rotationDirection > 0) {
    // Gradvis skru ned farten når pendelen beveger seg nedover før 180 grader
    rotationSpeed -= 0.05;
    if (rotationSpeed < 0.1) {
      rotationSpeed = 0.1;
    }
  } else if (rotationAngle < 90 && rotationDirection > 0) {
    // Gradvis skru farten opp når pendelen beveger seg nedover etter 0 grader
    rotationSpeed += 0.05;
  }

    // Beregn koordinatene for pil hodet til den grønne pilen
  if (rotationAngle < 90) {
    greenArrowheadX1 = greenArrowEndpointX - 12 * Math.cos(greenArrowheadAngle1);
    greenArrowheadY1 = greenArrowEndpointY - 12 * Math.sin(greenArrowheadAngle1);

    greenArrowheadX2 = greenArrowEndpointX - 12 * Math.cos(greenArrowheadAngle2);
    greenArrowheadY2 = greenArrowEndpointY - 12 * Math.sin(greenArrowheadAngle2);
  } else if (rotationAngle >= 90) {
    greenArrowheadX1 = greenArrowEndpointX + 12 * Math.cos(greenArrowheadAngle1);
    greenArrowheadY1 = greenArrowEndpointY + 12 * Math.sin(greenArrowheadAngle1);

    greenArrowheadX2 = greenArrowEndpointX + 12 * Math.cos(greenArrowheadAngle2);
    greenArrowheadY2 = greenArrowEndpointY + 12 * Math.sin(greenArrowheadAngle2);
  }

  

// Tegn pendel massen som en sirkel
c.fillStyle = "gray";
c.beginPath();
c.arc(pendulumX, pendulumY, massRadius, 0, Math.PI * 2);
c.fill();

// Tegn pendel linjen
c.beginPath();
c.moveTo(centerX, centerY);
c.lineTo(pendulumX, pendulumY);
c.strokeStyle = "black";
c.stroke();

// Tegn den grønne pilen
c.beginPath();
c.moveTo(pendulumX, pendulumY);
c.lineTo(greenArrowEndpointX, greenArrowEndpointY);
c.strokeStyle = "green";
c.lineWidth = 2;
c.stroke();

// Tegn pil hodet for den grønne pilen
c.moveTo(greenArrowEndpointX, greenArrowEndpointY);
c.lineTo(greenArrowheadX1, greenArrowheadY1);
c.lineTo(greenArrowheadX2, greenArrowheadY2);
c.closePath();
c.fillStyle = "green";
c.fill();

// Tegn den blåe pilen
c.beginPath(); 
c.moveTo(pendulumX, pendulumY);
c.lineTo(blueArrowPositionX, blueArrowPositionY);
c.strokeStyle = "blue"; 
c.lineWidth = 2;
c.stroke();
c.moveTo(blueArrowHeadX1, blueArrowHeadY1);
c.lineTo(blueArrowPositionX, blueArrowPositionY);
c.lineTo(blueArrowHeadX2, blueArrowHeadY2);
c.lineTo(blueArrowPositionX, blueArrowPositionY);
c.lineTo(blueArrowHeadX3, blueArrowHeadY3);

c.stroke();
c.font = "bold 16px Arial";
c.fillStyle = "blue"; 
c.fillText("S", blueArrowHeadX1 + 10, blueArrowHeadY1 + 20);

// Tegn den røde pilen
c.beginPath();
c.moveTo(gravityArrowX, gravityArrowY);
c.lineTo(gravityArrowX, gravityArrowY + gravityArrowLength);
c.strokeStyle = "red"; 
c.lineWidth = 2;
c.stroke();
c.moveTo(gravityArrowX - 5, gravityArrowY + gravityArrowLength - 10);
c.lineTo(gravityArrowX, gravityArrowY + gravityArrowLength);
c.lineTo(gravityArrowX + 5, gravityArrowY + gravityArrowLength - 10);
c.stroke();

c.font = "bold 16px Arial";
c.fillStyle = "red";
c.fillText("G", gravityArrowX + 10, gravityArrowY + gravityArrowLength - 15);
}

function animate() {
drawPendulum();
requestAnimationFrame(animate);
}

animate();
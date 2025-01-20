let krajniCara1;
let krajniCara2;
let stredniCara = 0;
let felina;
let felinaX;
let felinaY;
let cyklozmrd = [];
let cyklozmrdImage;
let score = 0;

let moveLeft = false;
let moveRight = false;

function preload() {
  felina = loadImage(`felina.png`);
  cyklozmrdImage = loadImage(`cyklozmrd.png`);
}

function setup() {
  createCanvas(600, 1080);
  felinaX = width / 2;
  felinaY = height - 320; 
}

function draw() {
  background(0);

  fill("white");
  krajniCara1 = rect(20, 0, 20, 1080);
  krajniCara2 = rect(560, 0, 20, 1080);

  // Střední čára
  for (let y = -20; y < height; y += 80) {
    fill(255);
    rect(width / 2 - 5, y + stredniCara, 15, 40);
  }
  stredniCara += 5;
  if (stredniCara >= 80) stredniCara = 0;

  let speed = 5; // Nastavení rychlosti auta
  if (moveLeft) felinaX -= speed;
  if (moveRight) felinaX += speed;
  felinaX = constrain(felinaX, 60, width - 160);

  image(felina, felinaX, felinaY, 100, 200);

  if (frameCount % 60 === 0 && cyklozmrd.length < 2) {
    spawnCyklozmrd();
  }

  for (let i = cyklozmrd.length - 1; i >= 0; i--) {
    cyklozmrd[i].y += cyklozmrd[i].speed;
    image(cyklozmrdImage, cyklozmrd[i].x, cyklozmrd[i].y, 50, 100);

    if (detectCollision(cyklozmrd[i])) {
      cyklozmrd.splice(i, 1);
      score += 1;
    } else if (cyklozmrd[i].y > height) {
      cyklozmrd.splice(i, 1);
    }
  }

  fill(255);
  textSize(24);
  text("   Score: " + score, 20, 40);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) moveLeft = true;
  if (keyCode === RIGHT_ARROW) moveRight = true;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) moveLeft = false;
  if (keyCode === RIGHT_ARROW) moveRight = false;
}

function spawnCyklozmrd() {
  let x = random(80, width - 130);
  let speed = random(5, 10);
  cyklozmrd.push({ x: x, y: -50, speed: speed });
}

function detectCollision(cyklo) {
  let carLeft = felinaX;
  let carRight = felinaX + 100;
  let carTop = felinaY;
  let carBottom = felinaY + 200;

  let objLeft = cyklo.x;
  let objRight = cyklo.x + 50;
  let objTop = cyklo.y;
  let objBottom = cyklo.y + 50;

  return (
    carRight > objLeft &&
    carLeft < objRight &&
    carBottom > objTop &&
    carTop < objBottom
  );
}

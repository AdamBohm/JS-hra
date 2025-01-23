let krajniCara1;
let krajniCara2;
let stredniCara = 0;
let felina;
let felinaX;
let felinaY;
let zliCyklisti = [];
let cyklozmrdImage;
let score = 0;

let moveLeft = false;
let moveRight = false;
let fireEffect = false;
let fireDuration = 120; // Trvání ohně
let scoreSound;
let ohenImage;

function preload() {
    felina = loadImage(`felina.png`);
    cyklozmrdImage = loadImage(`cyklozmrd.png`);
    scoreSound = loadSound(`strileni.mp3`);
    ohenImage = loadImage(`ohen.png`);
}

function setup() {
    createCanvas(600, 1080);
    felinaX = width / 2;
    felinaY = height - 320;
}

function draw() {
    background(0);

    // Kraje silnice
    fill("white");
    rect(20, 0, 20, 1080);
    rect(560, 0, 20, 1080);

    // Střední čára
    for (let y = -20; y < height; y += 80) {
        fill(255);
        rect(width / 2 - 5, y + stredniCara, 15, 40);
    }
    stredniCara += 5;
    if (stredniCara >= 80) stredniCara = 0;

    // Pohyb auta
    let speed = 5;
    if (moveLeft) felinaX -= speed;
    if (moveRight) felinaX += speed;
    felinaX = constrain(felinaX, 60, width - 160);

    // Efekt ohně
    if (fireEffect) {
        drawFireEffect();
        fireDuration--;
        if (fireDuration <= 0) {
            fireEffect = false; // Deaktivace efektu po vypršení trvání
        }
    }

    // Auto
    image(felina, felinaX, felinaY, 100, 200);

    if (frameCount % 60 === 0 && zliCyklisti.length < 2) {
        spawnZlyCyklista();
    }

    for (let i = zliCyklisti.length - 1; i >= 0; i--) {
        zliCyklisti[i].y += zliCyklisti[i].movementSpeed;
        image(cyklozmrdImage, zliCyklisti[i].x, zliCyklisti[i].y, 50, 100);

        if (detectCollision(zliCyklisti[i])) {
            zliCyklisti.splice(i, 1);
            score += 1;

            // Spuštění efektu ohně
            if (score % 10 === 0) {
                playScoreSound();
                fireEffect = true;
                fireDuration = 60; 
            }
        } else if (zliCyklisti[i].y > height) {
            zliCyklisti.splice(i, 1);
        }
    }

    // Zobrazení skóre
    fill(255);
    textSize(24);
    text("    Score: " + score, 20, 40);
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) moveLeft = true;
    if (keyCode === RIGHT_ARROW) moveRight = true;
}

function keyReleased() {
    if (keyCode === LEFT_ARROW) moveLeft = false;
    if (keyCode === RIGHT_ARROW) moveRight = false;
}

function spawnZlyCyklista() {
    let x = random(80, width - 130);
    let movementSpeed = random(5, 10); 
    zliCyklisti.push({ x: x, y: -50, movementSpeed: movementSpeed });
}

function detectCollision(cyklo) {
    let carLeft = felinaX;
    let carRight = felinaX + 100;
    let carTop = felinaY;
    let carBottom = felinaY + 200;

    let objLeft = cyklo.x;
    let objRight = cyklo.x + 50;
    let objTop = cyklo.y;
    let objBottom = cyklo.y + 100;

    return (
        carRight > objLeft &&
        carLeft < objRight &&
        carBottom > objTop &&
        carTop < objBottom
    );
}

function playScoreSound() {
    if (scoreSound && !scoreSound.isPlaying()) {
        scoreSound.play();
    }
}

function drawFireEffect() {
    let fireX = felinaX - 15;
    let fireY = felinaY + 180;

    // Vykreslení efektu ohně
    if (ohenImage) {
        image(ohenImage, fireX, fireY, 40, 60);
    }
}

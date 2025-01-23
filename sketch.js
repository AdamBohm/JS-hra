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

class Cyklista {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    move() {
        this.y += this.speed;
    }

    show() {
        image(cyklozmrdImage, this.x, this.y, 50, 100);
    }

    isOffScreen() {
        return this.y > height;
    }

    detectCollision(carX, carY) {
        let carLeft = carX;
        let carRight = carX + 100;
        let carTop = carY;
        let carBottom = carY + 200;

        let objLeft = this.x;
        let objRight = this.x + 50;
        let objTop = this.y;
        let objBottom = this.y + 100;

        return (
            carRight > objLeft &&
            carLeft < objRight &&
            carBottom > objTop &&
            carTop < objBottom
        );
    }
}

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

    let speed = 5;
    if (moveLeft) felinaX -= speed;
    if (moveRight) felinaX += speed;
    felinaX = constrain(felinaX, 60, width - 160);

    // Efekt ohně
    if (fireEffect) {
        drawFireEffect();
        fireDuration--;
        if (fireDuration <= 0) {
            fireEffect = false; // Deaktivace efektu 
        }
    }

    image(felina, felinaX, felinaY, 100, 200);

    if (frameCount % 60 === 0 && zliCyklisti.length < 2) {
        spawnZlyCyklista();
    }

    for (let i = zliCyklisti.length - 1; i >= 0; i--) {
        zliCyklisti[i].move();
        zliCyklisti[i].show();

        if (zliCyklisti[i].detectCollision(felinaX, felinaY)) {
            zliCyklisti.splice(i, 1);
            score += 1;

            // Spuštění efektu ohně
            if (score % 10 === 0) {
                playScoreSound();
                fireEffect = true;
                fireDuration = 60; // Reset trvání efektu ohně
            }
        } else if (zliCyklisti[i].isOffScreen()) {
            zliCyklisti.splice(i, 1);
        }
    }

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
    let speed = random(5, 10);
    zliCyklisti.push(new Cyklista(x, -50, speed));
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

import { playsound } from './Sound.js'
const panorama = document.getElementById("panorama");
const leftArrow = document.getElementById("panorama_arrow_left");
const rightArrow = document.getElementById("panorama_arrow_right");
let absolutePanoramaXPos = 0.0;

let scrolling = false;
let scrollDirection = 0; // -1 = droite, 1 = gauche
let speed = 1.0;
const incr = 0.01;
const MAXSPEED = 6.5;

export function updatePanorama() {
    panorama.style.backgroundPosition = `${parseInt(absolutePanoramaXPos)}px 0px`;
}

function scrollPanorama() {
    if (!scrolling) return;

    speed = Math.min(speed + incr, MAXSPEED);
    absolutePanoramaXPos += scrollDirection * speed;

    panorama.style.backgroundPosition = `${parseInt(absolutePanoramaXPos)}px 0px`;

    requestAnimationFrame(scrollPanorama);
}

function startScrolling(direction) {
    playsound('click', 0.05);
    scrollDirection = direction;
    if (!scrolling) {
        scrolling = true;
        requestAnimationFrame(scrollPanorama);
    }
}

function stopScrolling() {
    speed = 1.0;
    scrolling = false;
}

// Événements pour clic maintenu
leftArrow.addEventListener("mousedown", () => startScrolling(1));
rightArrow.addEventListener("mousedown", () => startScrolling(-1));

document.addEventListener("mouseup", stopScrolling);
document.addEventListener("mouseleave", stopScrolling);

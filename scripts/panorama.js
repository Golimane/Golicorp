const panorama = document.getElementById("panorama");
const leftArrow = document.getElementById("panorama_arrow_left");
const rightArrow = document.getElementById("panorama_arrow_right");

let scrolling = false;
let scrollDirection = 0; // -1 = droite, 1 = gauche
let speed = 1.0;
const incr = 0.01;
const MAXSPEED = 6.5;

function scrollPanorama() {
    if (!scrolling) return;

    // Récupère la position actuelle à chaque appel
    const panoramaBackgroundX = parseInt(
        window.getComputedStyle(panorama).backgroundPositionX,
        10
    ) || 0;

    speed = Math.min(speed + incr, MAXSPEED);
    console.log(`current speed = ${speed}`);
    panorama.style.backgroundPosition = `${panoramaBackgroundX + scrollDirection * speed}px 0px`;

    requestAnimationFrame(scrollPanorama);
}

function startScrolling(direction) {
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

function mobSay() {
    const mobSay = [
        "./sounds/mob/zombiesay0.mp3",
        "./sounds/mob/zombiesay1.mp3",
        "./sounds/mob/zombiesay2.mp3",
        "./sounds/mob/creepersay0.mp3",
        "./sounds/mob/creepersay1.mp3",
        "./sounds/mob/creepersay2.mp3",
        "./sounds/mob/skeletonsay0.mp3",
        "./sounds/mob/skeletonsay1.mp3",
        "./sounds/mob/skeletonsay2.mp3",
        "./sounds/mob/spidersay0.mp3",
        "./sounds/mob/spidersay1.mp3",
        "./sounds/mob/spidersay2.mp3",
        "./sounds/mob/spidersay3.mp3"
    ];
    new Audio(mobSay[Math.floor(Math.random() * mobSay.length)]).play();
    const logo = document.querySelector("header");
    logo.classList.add("shake");
    // setTimeout(() => this.classList.remove("shake"), 400);

    setTimeout(() => {
        if (document.body.contains(logo)) {
            logo.classList.remove("shake");
        }
    }, 400);
}
async function randomMobSay() {
    while (true) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 120000 + 240000));
        mobSay();
    }
}
randomMobSay();
document.getElementById("logo").addEventListener('click', mobSay)
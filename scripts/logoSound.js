function mobSay() {
    const mobSay = [
        "./sounds/zombiesay0.mp3",
        "./sounds/zombiesay1.mp3",
        "./sounds/zombiesay2.mp3",
        "./sounds/creepersay0.mp3",
        "./sounds/creepersay1.mp3",
        "./sounds/creepersay2.mp3",
        "./sounds/skeletonsay0.mp3",
        "./sounds/skeletonsay1.mp3",
        "./sounds/skeletonsay2.mp3",
        "./sounds/spidersay0.mp3",
        "./sounds/spidersay1.mp3",
        "./sounds/spidersay2.mp3",
        "./sounds/spidersay3.mp3"
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
        await new Promise(resolve => setTimeout(resolve, Math.random() * 60000 + 120000));
        mobSay();
    }
}
randomMobSay();
document.getElementById("logo").addEventListener('click', mobSay)
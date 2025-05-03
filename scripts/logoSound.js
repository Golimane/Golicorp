export function mobSay() {
    playsound('click');
    playsound("mob");

    // shake logo
    const logo = document.querySelector("header");
    logo.classList.add("shake");

    setTimeout(() => {
        if (document.body.contains(logo)) {
            logo.classList.remove("shake");
        }
    }, 400);
}
/*async function randomMobSay() {
    while (true) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 120000 + 240000));
        mobSay();
    }
}
randomMobSay();*/


export function playsound(soundtype) {
    let audioPath;

    if (soundtype === "mob") {
        const mobSoundsPath = [
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
        audioPath = mobSoundsPath[Math.floor(Math.random() * mobSoundsPath.length)];
    } else if (soundtype === "switch") {
        const i = Math.floor(Math.random() * 5);
        audioPath = `./sounds/select/select_${i}.mp3`;
    } else if (soundtype === "click") {
        audioPath = "./sounds/click.mp3";
    } else if (soundtype === "discret") {
        audioPath = "./sounds/select/discret.mp3";
    } else {
        console.warn("Type de son inconnu :", soundtype);
        return;
    }

    const audio = new Audio(audioPath);
    audio.play().catch((err) => console.error("Erreur lors de la lecture :", err));
}
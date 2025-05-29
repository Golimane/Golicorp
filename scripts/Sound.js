const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export function mobSay() {
    playsound('click', 0.05);
    playsound("mob", 0.25);

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


export async function playsound(soundtype, randomPitch = 0.0) {
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


    // Randomize the pitch and play
    try {
        const response = await fetch(audioPath);
        const buffer = await audioContext.decodeAudioData(await response.arrayBuffer());
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        // randomize pitch
        const pitchRatio = 1.0 + (Math.random() * 2 - 1) * randomPitch;
        source.detune.value = 1200 * Math.log2(pitchRatio); // Conversion en cents
        
        source.connect(audioContext.destination);
        source.start();
        
        console.log(`Playing with pitch ratio: ${pitchRatio.toFixed(2)} (${source.detune.value.toFixed(0)} cents)`);
    } catch (err) {
        console.error("Erreur lors de la lecture :", err);
    }
}
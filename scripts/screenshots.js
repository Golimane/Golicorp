import { playsound } from './Sound.js'
const IMGNOTFOUNDJPG = "./img/img_not_found.jpg"


let currentIndex = 0;
let screenshotsUrlList = [];

let hiddenPreviousScreenshot;
let previousPreviousScreenshot;
let previousScreenshot;
let currentScreenshot;
let nextScreenshot;
let nextNextScreenshot;
let hiddenNextScreenshot;



export function setScreenshotsUrlList(images) {
    screenshotsUrlList = images?.filter(image => image.tag === 'screenshot').map(i => i.url) || [];

    if (screenshotsUrlList.length === 0) return false;
    
    setScreenshots();
    return true;
}
function getScreenshotFromIndex(index) {
    const size = screenshotsUrlList.length;
    if (!screenshotsUrlList.length) return IMGNOTFOUNDJPG;

    const normalizedIndex = ((index % size) + size) % size;
    return screenshotsUrlList[normalizedIndex];
}
function setScreenshots() {
    const carouselElements = [ hiddenPreviousScreenshot, previousPreviousScreenshot, previousScreenshot, currentScreenshot, nextScreenshot, nextNextScreenshot, hiddenNextScreenshot ];
    const offsets = [-3, -2, -1, 0, 1, 2, 3];
    Object.values(carouselElements).forEach((el, i) => {
        el.style.backgroundImage = `url(${getScreenshotFromIndex(currentIndex + offsets[i])})`;
    });
}

export function updateVariables() {
    // Remove event listners
    // const screenshotElements = [previousPreviousScreenshot, previousScreenshot, nextScreenshot, nextNextScreenshot ]
    // const functions = [ previousScreenshotClick, previousScreenshotClick, nextScreenshotClick, nextScreenshotClick ]
    // for (let i = 0; i < screenshotElements.length; i++ ) {
    //     screenshotElements[i]?.removeEventListener("click", functions[i])
    // }
    previousPreviousScreenshot?.removeEventListener("click", previousPreviousScreenshotClick);
    previousScreenshot?.removeEventListener("click", previousScreenshotClick);
    nextScreenshot?.removeEventListener("click", nextScreenshotClick);
    nextNextScreenshot?.removeEventListener("click", nextNextScreenshotClick);

    // Update variables
    hiddenPreviousScreenshot = document.getElementById("screenshot_hidden_previous");
    previousPreviousScreenshot = document.getElementById("screenshot_previousprevious");
    previousScreenshot = document.getElementById("screenshot_previous");
    currentScreenshot = document.getElementById("screenshot_current");
    nextScreenshot = document.getElementById("screenshot_next");
    nextNextScreenshot = document.getElementById("screenshot_nextnext");
    hiddenNextScreenshot = document.getElementById("screenshot_hidden_next");
    
    // Update event listener
    previousPreviousScreenshot?.addEventListener("click", previousPreviousScreenshotClick);
    previousScreenshot?.addEventListener("click", previousScreenshotClick);
    nextScreenshot?.addEventListener("click", nextScreenshotClick);
    nextNextScreenshot?.addEventListener("click", nextNextScreenshotClick);
}


// CAROUSEL BEHAVIORS
function previousPreviousScreenshotClick() {
    previousScreenshotClick(true);
    setTimeout(previousScreenshotClick, 500);
}
function previousScreenshotClick(sound = false) {
    if (sound) playsound('discret');
    const size = screenshotsUrlList.length;
    currentIndex = (((currentIndex - 1) % size) + size) % size;

    // Move all
    hiddenPreviousScreenshot.id = "screenshot_previousprevious"
    previousPreviousScreenshot.id = "screenshot_previous";
    previousScreenshot.id = "screenshot_current";
    currentScreenshot.id = "screenshot_next";
    nextScreenshot.id = "screenshot_nextnext";
    nextNextScreenshot.id = "screenshot_hidden_next";
    hiddenNextScreenshot.id = "screenshot_hidden_previous";
    
    updateVariables();

    //Update images of hidden one
    hiddenPreviousScreenshot.style.backgroundImage = `url(${getScreenshotFromIndex(currentIndex - 3)})`;
}
function nextNextScreenshotClick() {
    nextScreenshotClick(true);
    setTimeout(nextScreenshotClick, 500);
}
function nextScreenshotClick(sound = false) {
    if (sound) playsound('discret', 0.15);
    const size = screenshotsUrlList.length;
    currentIndex = (currentIndex + 1) % size;

    // Move all
    hiddenPreviousScreenshot.id = "screenshot_hidden_next"
    previousPreviousScreenshot.id = "screenshot_hidden_previous";
    previousScreenshot.id = "screenshot_previousprevious";
    currentScreenshot.id = "screenshot_previous";
    nextScreenshot.id = "screenshot_current";
    nextNextScreenshot.id = "screenshot_next";
    hiddenNextScreenshot.id = "screenshot_nextnext";
    
    updateVariables();

    //Update images of hidden one
    hiddenNextScreenshot.style.backgroundImage = `url(${getScreenshotFromIndex(currentIndex + 3)})`;
}
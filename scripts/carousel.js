import { getVibrantColor, getLightVibrantColor } from './image.js';
import { setScreenshotsUrlList, updateVariables } from './screenshots.js'
import { updatePanorama } from './panorama.js';
import { mobSay, playsound } from './Sound.js'
document.getElementById("logo").addEventListener('click', mobSay);


const IMGNOTFOUNDJPG = "./img/img_not_found.jpg"


let currentTrailerUrl = ""
let showAllContent = false;
let mainContentList = [];
let currentContentList = [];
let previousContent;

function shuffleArray(array) {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

const loadingCache = document.getElementById("loadingCache");
const checkContentListReady = setInterval(() => {
    if (window.contentList && window.contentList.length > 0) {
        clearInterval(checkContentListReady);
        for (let content of window.contentList) {
            // console.log(`${content['title']['neutral']} main ? ${content['is_amin'] ? 'true' : 'false'}`);
            if ('is_main' in content && content['is_main']) {
                mainContentList.push(content);
                // console.log(`${content['title']['neutral']} IS MAIN`);
            }
        }
        currentContentList = shuffleArray(mainContentList);
        updateCarousel();
        if (loadingCache) {
            loadingCache.remove();
        }
    }
}, 100);

let previousPreviousImg;
let previousImg;
let currentImg;
let nextImg;
let nextNextImg;
let playButton;


const bgImg = document.getElementById("bgImg");
const bgTransition = document.getElementById("bgTransition");

const title = document.getElementById("title");
const studio = document.getElementById("studio");
const description = document.getElementById("description");
const tagsContainer = document.getElementById("tags");
const priceTxt = document.getElementById("priceTxt");
const detailsContent = document.getElementById("detailsContent");


let currentIndex = 0;



const getItem = document.getElementById("getItem");
getItem.addEventListener('click', goToBuyLink);

function goToTrailer() {
    playsound('click', 0.05);
    if (currentTrailerUrl != '') window.open(currentTrailerUrl, "_blank");
}
function goToBuyLink() {
    playsound('click', 0.05);
    const id = currentContentList[currentIndex]['id'];
    const link = `https://www.minecraft.net/fr-fr/marketplace/pdp?id=${id}`;

    window.open(link, "_blank");
}



// GETTER FROM CONTENT INDEX
function getThumbnail(index) {
    const images = currentContentList[index]?.images;
    if (images) {
        for (let image of images) {
            if (image['tag'] === 'Thumbnail' || image['type'] === 'Thumbnail') {
				return image['url'];
            }
        }
    }
    return IMGNOTFOUNDJPG;
}
function getPanorama(images) {
    return images?.find(image => image.tag === 'panorama')?.url || undefined;
}





document.getElementById("previousButton").addEventListener("click", carouselPrevious);
document.getElementById("nextButton").addEventListener("click", carouselNext);
// CAROUSEL BEHAVIORS
function setCarouselImgs() {
    // Remove old event listeners
    playButton?.removeEventListener("click", goToTrailer);
    previousImg?.removeEventListener("click", carouselPrevious);
    nextImg?.removeEventListener("click", carouselNext);

    // Update variables
    previousPreviousImg = document.getElementById("previousprevious");
    previousImg = document.getElementById("previous");
    currentImg = document.getElementById("current");
    nextImg = document.getElementById("next");
    nextNextImg = document.getElementById("nextnext");
    playButton = document.getElementById("playButton");
    //Update Alt
    previousImg.alt = "Previous Image";
    currentImg.alt = "Current Image";
    nextImg.alt = "Next Image";

    // Update event listeners
    playButton?.addEventListener("click", goToTrailer);
    previousImg?.addEventListener("click", carouselPrevious);
    nextImg?.addEventListener("click", carouselNext);
}
setCarouselImgs();
function endCarouselAnimation(incrIndex, recreateElement) {
    if (recreateElement) {
        const newDiv = document.createElement('img');
        newDiv.id = recreateElement;
        document.getElementsByClassName('carousel')[0].appendChild(newDiv);
    }
    

    // Smooth changing of bg
    const nextIndex = (currentIndex + incrIndex) % currentContentList.length;
    bgTransition.style.backgroundImage = `url(${getThumbnail(nextIndex)})`;
    bgTransition.style.opacity = 1.0;


    setCarouselImgs();
    


    setTimeout(() => {
        currentIndex = (currentIndex + incrIndex + currentContentList.length) % currentContentList.length;
        let currentContent = currentContentList[currentIndex];
        console.log(`Opening ${currentContent['title']['neutral']}`);
        document.getElementById('hidden')?.remove();
        document.getElementById('playButtonNext')?.remove();
        document.getElementById('playButtonPrevious')?.remove();
        updateSources();
    }, 500)
}
function carouselPrevious() {
    previousPreviousImg.id = "previous";
    previousImg.id = "current";
    currentImg.id = "next";
    nextImg.id = "nextnext";
    nextNextImg.id = "hidden";

    if (playButton) playButton.id = "playButtonNext";

    playsound('switch', 0.1);
    endCarouselAnimation(-1, "previousprevious");
}
function carouselNext() {
    previousPreviousImg.id = "hidden";
    previousImg.id = "previousprevious";
    currentImg.id = "previous";
    currentImg.class = "carouselNotCurrent";
    nextImg.id = "current";
    nextNextImg.id = "next";

    if (playButton) playButton.id = "playButtonPrevious";

    playsound('switch', 0.1);
    endCarouselAnimation(1, "nextnext");
}






// SETTER FOR CONTENT DISPLAY
function setTitle(strTitle) {
    title.textContent = strTitle;
}
function setDescription(containerBalise, text) {
    containerBalise.innerHTML = "";

    (text.split('\n')).forEach(line => {
        const h2 = document.createElement("h2");
        h2.textContent = line;
        containerBalise.appendChild(h2);
    });
}
function setTags(containerBalise, tags) {
    containerBalise.innerHTML = "";

    tags.forEach(line => {
        const h2 = document.createElement("h2");
        let tag = line.split('.')
						.at(-1)
						.replace(/^\w/, (c) => c.toUpperCase());;
        h2.textContent = tag.replace('_', ' ');
        containerBalise.appendChild(h2);
    });
}
function setRating(averageRating, totalRatingsCount) {
    // const filledStars = document.getElementById("starsFull");
    // const emptyStars = document.getElementById("starsEmpty");
    const rateNumber = document.getElementById("rateNumber");
    const percentage = Math.min(Math.max(averageRating, 0), 5) * 20;
    document.querySelector('.stars-full').style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    // filledStars.style.width = `${percentage}%`;
    // emptyStars.style.width = `${100-percentage}%`;
    rateNumber.textContent = `${totalRatingsCount} rates`
}
function setPrice(price) {
    priceTxt.textContent = `${price}`
}
function setStudio(studioName) {
    studio.textContent = `By ${studioName}`
}
function setDetails(details) {
    if (!(details instanceof Array)) {
        details = [details];
    }
    detailsContent.innerHTML = '';
    for (let detail of details) {
        detail.split("\n").forEach(function(d) {
            const p = document.createElement('p');
            p.textContent = d;
            detailsContent.appendChild(p);
        });
    }
}
function setPlayButton(state) {
    if (state) {
        // console.log('Adding playButton');
        const newButton = document.createElement('img');
        newButton.classList.add("playButtonOff");
        newButton.id = "playButton";
        newButton.alt = "Play Trailer";
        newButton.src = "img/play.png";
        document.getElementsByClassName('carousel')[0].appendChild(newButton);
        
        setTimeout(() => {
            newButton.classList.remove("playButtonOff");
            newButton.classList.add("playButtonOn");
            newButton.addEventListener('click', goToTrailer);
        }, 10);
        playButton = document.getElementById("playButton");
    }
}






async function updateColor(thumbnail) {
    try {
        let lightColor = await getLightVibrantColor(thumbnail);
        document.documentElement.style.setProperty('--color-light', `rgb(${lightColor[0]}, ${lightColor[1]}, ${lightColor[2]})`);
    } catch (error) {
        console.error("Erreur lors de l'obtention de la couleur :", error);
    }
}
function updateSources() {
    const positions = [-2, -1, 0, 1, 2];
    const elements = [previousPreviousImg, previousImg, currentImg, nextImg, nextNextImg];

    elements.forEach((element, index) => {
        const newIndex = (currentIndex + positions[index] + currentContentList.length) % currentContentList.length;
        element.src = getThumbnail(newIndex);
    });

	let thumbnail = getThumbnail(currentIndex);
	updateColor(thumbnail);
    bgImg.style.backgroundImage = `url(${thumbnail})`;
    bgTransition.style.opacity = 0;
    
    let currentContent = currentContentList[currentIndex];
    console.log(JSON.stringify(currentContent)['title']);
    setTitle(
        currentContent['title']['neutral']
    );
    setDescription(
        description,
        currentContent['description']['neutral']
    );

    setRating(
        currentContent['rating']['averageRating'],
        currentContent['rating']['totalRatingsCount']
    );
    setPrice(
        currentContent['displayProperties']['price']
    );
    setTags(
        tagsContainer,
        currentContent['tags']
    );
    setStudio(
        currentContent['displayProperties']['creatorName']
    );
    setDetails(
        currentContent['my_part']
    );
    let displayProperties = currentContent['displayProperties'];
    let hasTrailer = 'videoUrl' in displayProperties;
    setPlayButton(hasTrailer);
    if (hasTrailer) currentTrailerUrl = displayProperties['videoUrl'];

    let screenshotsContainer = document.getElementById("screenshots");
    updateVariables();
    if (setScreenshotsUrlList(currentContent?.images)) {
        screenshotsContainer.style.display = ''
    } else {
        screenshotsContainer.style.display = 'none'
    }

	let panoramaImg = getPanorama(
        currentContent['images']
    );
    let panorama = document.getElementById("panorama");
    if ( panoramaImg ) {
        let img = new Image();
        img.src = panoramaImg;
        img.onload = function () {
            let ratio = img.height / img.width; // Calcul du ratio hauteur/largeur
            let panoramaWidth = panorama.clientWidth; // Largeur actuelle de l'élément
            
            panorama.style.height = `${panoramaWidth * ratio * 1}px`; // Applique la hauteur proportionnelle
            panorama.style.background = `url(${panoramaImg}) repeat-x top left / auto 100%`;
            panorama.style.display = '';
            updatePanorama();
        }
    } else {
        panorama.style.display = 'none'
    }
}
function updateCarousel() {
    let contentListLength = currentContentList.length
    previousPreviousImg.src = getThumbnail((currentIndex - 2 + contentListLength) % contentListLength);
    previousImg.src = getThumbnail((currentIndex - 1 + contentListLength) % contentListLength);
    currentImg.src = getThumbnail(currentIndex);
    nextImg.src = getThumbnail((currentIndex + 1) % contentListLength);
    nextNextImg.src = getThumbnail((currentIndex + 2) % contentListLength);
    bgImg.style.backgroundImage = `url(${getThumbnail(currentIndex)})`;

    playButton?.parentNode?.removeChild(playButton);
    updateSources();
}






// TOGGLE TO SHOW ONLY MAIN CONTENTS OR ALL OF THEM
function indexFromId(currentContentList, id) { 
    return currentContentList?.findIndex(item => item?.id == id) ?? -1;
}
function forceIndex(id) {
    console.log(`forcing index ${indexFromId(currentContentList, id)} for id ${id}`)
    currentIndex = indexFromId(currentContentList, id);
}
const toggleContainer = document.getElementById('toggle-container');
const toggleBg = document.getElementById('toggle-content');

toggleContainer.addEventListener('click', toggleShowAll);
function toggleShowAll() {
    playsound('click', 0.05);
    previousContent = currentContentList[currentIndex];
    showAllContent = !showAllContent;
    console.log('showAllContent ->', showAllContent ? "showing all content" : "showing only main content");
    
    toggleBg.classList.toggle('active', showAllContent);
    // toggleContainer.classList.toggle('active', showAllContent);
    document.getElementById('main_content_txt').classList.toggle('active', !showAllContent);
    document.getElementById('all_content_txt').classList.toggle('active', showAllContent);
    currentContentList = shuffleArray(showAllContent ? window.contentList : mainContentList);

    // Force index to be on same index 
    if (!showAllContent && indexFromId(currentContentList, previousContent['id']) < 0) {
        currentContentList.push(previousContent);
    }
    forceIndex(previousContent['id']);

    updateCarousel();
}
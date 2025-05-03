export function getVibrantColor(imgUrl) {
    return new Promise((resolve, reject) => {
        console.log(`Getting vibrant color of ${imgUrl}`);

        const img = new Image();
        img.crossOrigin = "anonymous"; // Pour éviter les erreurs CORS
        img.src = imgUrl;

        img.onload = () => {
            Vibrant.from(img)
                .getPalette()
                .then(palette => {
                    if (palette?.Vibrant) {
                        const color = palette.Vibrant.getRgb(); // Retourne [r, g, b]
                        console.log(`Couleur dominante (get): rgb(${color[0]}, ${color[1]}, ${color[2]})`);
                        resolve(color);
                    } else {
                        reject("Aucune couleur dominante trouvée.");
                    }
                })
                .catch(err => reject("Erreur Vibrant: " + err));
        };

        img.onerror = () => reject("Erreur de chargement de l'image.");
    });
}




function lightenColor(r, g, b, percent) {
    // Assurer que le pourcentage est entre 0 et 100
    percent = Math.min(100, Math.max(0, percent));

    // Calculer la nouvelle valeur pour chaque canal
    const lighten = (value) => Math.min(255, value + (255 - value) * (percent / 100));

    return [
        lighten(r),
        lighten(g),
        lighten(b)
    ];
}


export async function getLightVibrantColor(imgUrl) {
    let color = await getVibrantColor(imgUrl); // Attend la couleur
    return lightenColor(color[0], color[1], color[2], 66)  
}
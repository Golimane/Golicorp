window.contentList = [];

// DO NOT USE THAT
async function fetchProductDetails(id) {
    const url = `https://www.minecraft.net/bin/minecraft/productmanagement.productdetails.json?id=${id}`;

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': navigator.userAgent
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const productDetails = await response.json();
        console.log(url)
        return productDetails;
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails du produit ${id}:`, error);
        return null;
    }
}
// NOT THAT EITHER
async function loadContent() {
    const filename = 'golicontent.json';
    const filepath = `./scripts/${filename}`;

    const response = await fetch(filepath);
    const golicontent = await response.json();

    console.groupCollapsed("TMP CORS ALLOW");
    // Traiter chaque élément
    const results = await Promise.all(
        golicontent.map(async ({ id, my_part }) => {
            const content = await fetchProductDetails(id);
            return { ...content, my_part };
        })
    );
    console.groupEnd();

    window.contentList.push(...results);
}


function mergeList(list1, list2) {
    const merged = {};
  
    for (const item of list1) {
      merged[item.id] = { ...item };
    }
    for (const item of list2) {
      merged[item.id] = { ...merged[item.id], ...item };
    }
    return Object.values(merged);
}

async function loadContentLocal() {
    let filename = 'golicontent.json';
    let filepath = `./scripts/${filename}`;
    let golicontent;
    try {
        const response = await fetch(filepath);
        golicontent = await response.json();
    } catch (error) {
        console.error(`Error loading ids from ${filename} :`, error);
    }



    filename = 'golicontent_local.json';
    filepath = `./scripts/${filename}`;
    try {
        const response = await fetch(filepath);
        const golicontent_local = await response.json();

        // Stocker les données dans la variable globale
        window.contentList = mergeList(golicontent, golicontent_local);
    } catch (error) {
        console.error('Erreur lors du chargement du contenu local :', error);
    }
}

loadContentLocal();
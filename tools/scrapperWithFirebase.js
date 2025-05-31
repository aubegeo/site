///NE FONCITONNE PAS CAR MAUSVAIS MAPPAGE DE DONNEES 
const puppeteer = require("puppeteer");
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccountKey.json"); // ton fichier JSON de clé

// Initialisation Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://www.amazon.fr/s?k=tablette+amazon", {
    waitUntil: "networkidle2"
  });

  const products = await page.evaluate(() => {
    const items = [];
    const productNodes = document.querySelectorAll('[data-component-type="s-search-result"]');

    productNodes.forEach((node) => {
      const titleNode = node.querySelector("h2 a span");
      const priceWhole = node.querySelector(".a-price .a-price-whole");
      const priceFraction = node.querySelector(".a-price .a-price-fraction");
      const rating = node.querySelector(".a-icon-alt");
      const reviewCount = node.querySelector(".a-size-base.s-underline-text");
      const linkNode = node.querySelector("h2 a");
      const imgNode = node.querySelector("img.s-image");
      const primeNode = node.querySelector(".a-icon-prime");

      items.push({
        name: titleNode?.innerText ?? null,
        price: priceWhole && priceFraction
          ? `${priceWhole.innerText}.${priceFraction.innerText}`
          : null,
        rating: rating?.innerText ?? null,
        reviewCount: reviewCount?.innerText ?? null,
        productUrl: linkNode
          ? "https://www.amazon.fr" + linkNode.getAttribute("href")
          : null,
        imageUrl: imgNode?.getAttribute("src") ?? null,
        isPrime: !!primeNode,
        type: "tablette"
      });
    });

    return items;
  });

  // 🔥 Insertion dans Firebase Firestore
  const collectionRef = db.collection("products");

  for (const product of products) {
    if (product.name && product.productUrl) {
      try {
        await collectionRef.add(product);
        console.log(`✅ Produit ajouté : ${product.name}`);
      } catch (error) {
        console.error(`❌ Erreur lors de l'ajout : ${product.name}`, error);
      }
    }
  }

  await browser.close();
})();

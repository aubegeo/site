import * as admin from "firebase-admin";
import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

admin.initializeApp();
const db = admin.firestore();

interface Product {
  name: string | null;
  price: string | null;
  rating: string | null;
  reviewCount: string | null;
  productUrl: string | null;
  imageUrl: string | null;
  isPrime: boolean;
  type: string;
}

export async function scrapeAmazonProduct(): Promise<void> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const maxPages = 1;
  const allProducts: Product[] = [];

  for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
    const page = await browser.newPage();

    // ✅ Simule un vrai utilisateur
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setJavaScriptEnabled(true);

    const url = `https://www.amazon.fr/s?k=tablette+amazon&page=${currentPage}`;
    console.log(`🔄 Scraping page ${currentPage} : ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000); // laisser la page se charger complètement

    const products: Product[] = await page.evaluate(() => {
      const items: Product[] = [];
      const nodes = document.querySelectorAll('[data-component-type="s-search-result"]');

      nodes.forEach((node) => {
        const name = node.querySelector("h2")?.innerText ?? null;
        const anchor = node.querySelector("a.a-link-normal[href*='/dp/']");
        const price = (node.querySelector(".a-price .a-offscreen") as HTMLElement)?.innerText ?? null;
        const rating = (node.querySelector(".a-icon-alt") as HTMLElement)?.innerText ?? null;
        const reviewCount = (node.querySelector(".a-size-base.s-underline-text") as HTMLElement)?.innerText ?? null;
        const imageUrl = node.querySelector("img.s-image")?.getAttribute("src") ?? null;
        const primeNode = node.querySelector(".a-icon-prime");

        items.push({
          name,
          price,
          rating,
          reviewCount,
          productUrl: anchor ? "https://www.amazon.fr" + anchor.getAttribute("href") : null,
          imageUrl,
          isPrime: !!primeNode,
          type: "tablette",
        });
      });

      return items;
    });

    console.log(`🛒 ${products.length} produits trouvés sur la page ${currentPage}`);
    allProducts.push(...products);
    await page.close();
  }

  await browser.close();

  if (allProducts.length === 0) {
    console.warn("❌ Aucun produit trouvé.");
    return;
  }

  // 🔥 Sauvegarde dans Firestore
  console.log(`✅ ${allProducts.length} produits au total. Enregistrement...`);
  const batch = db.batch();
  const productsRef = db.collection("products");

  allProducts.forEach((product) => {
    const docRef = productsRef.doc();
    batch.set(docRef, {
      ...product,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log("✅ Données enregistrées avec succès !");
}

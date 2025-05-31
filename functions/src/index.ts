/*import * as admin from "firebase-admin";
import * as puppeteer from "puppeteer";
import { formatAmazonAffiliateLink } from "./utils/amazon";
import chromium from 'chrome-aws-lambda';


import { onSchedule } from "firebase-functions/v2/scheduler";
import { scrapeAmazonProduct } from "./utils/scrape";

export const scrapeAmazon = onSchedule(
  {
    schedule: "every 2 hours",
    region: "europe-west1",
    memory: "1GiB",
    timeoutSeconds: 540,
    timeZone: "Europe/Paris",
  },
  async () => {
    const result = await scrapeAmazonProduct();
    console.log("Scraped :", result);
  }
);
*/
// ✅ Fonction HTTP manuelle
import * as functions from "firebase-functions/v2";
import puppeteer from "puppeteer";

functions.setGlobalOptions({ region: "europe-west1" });
functions.setGlobalOptions({ memory: "1GiB", timeoutSeconds: 300 });

export const scrapeAmazonHttp =  functions.https.onRequest(async (req, res) => {
    try {
      const browser = await puppeteer.launch({
        headless: 'shell', // ou "new"
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
      );

      const url = "https://www.amazon.fr/s?k=tablette+amazon";
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

      await new Promise(resolve => setTimeout(resolve, 3000)); // anti-bot delay

      const products = await page.evaluate(() => {
        const items: any[] = [];
        const nodes = document.querySelectorAll('[data-component-type="s-search-result"]');
        nodes.forEach((node) => {
          const h2 = node.querySelector("h2");
          const name = h2?.getAttribute("aria-label") ?? null;

          const anchor = node.querySelector("a.a-link-normal.s-line-clamp-4.s-link-style.a-text-normal");
          const priceWhole = node.querySelector(".a-price-whole");
          const priceFraction = node.querySelector(".a-price-fraction");
          const rating = node.querySelector(".a-icon-alt");
          const reviewCount = node.querySelector(".a-size-base.s-underline-text");
          const imgNode = node.querySelector("img.s-image");
          const primeNode = node.querySelector(".a-icon-prime");

          items.push({
            name,
            price: priceWhole && priceFraction
              ? `${(priceWhole as HTMLElement).innerText.replace(/[^\d]/g, "")}.${(priceFraction as HTMLElement).innerText}`
              : null,
            rating: rating ? (rating as HTMLElement).innerText : null,
            reviewCount: reviewCount ? (reviewCount as HTMLElement).innerText : null,
            productUrl: anchor ? "https://www.amazon.fr" + anchor.getAttribute("href") : null,
            imageUrl: imgNode?.getAttribute("src") ?? null,
            isPrime: !!primeNode,
          });
        });
        return items;
      });

      await browser.close();

      console.log(`✅ ${products.length} produits trouvés.`);
      res.status(200).json(products);
    } catch (error) {
      console.error("❌ Erreur de scraping :", error);
      res.status(500).json({ error: "Scraping échoué", details: error });
    }
  });

/*



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


exports.scrapeAmazon =  onSchedule(
  {
    schedule: "every 4 hours",
    region: "europe-west1",
    memory: "512MiB", 
    timeoutSeconds: 540, 
  },
  async (event) => {
   //lancement du navigateur 
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const maxPages = 3;
    let allProducts: Product[] = [];

    for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
      const page = await browser.newPage();

      // 🔻 Bloque les ressources inutiles
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const resourceType = req.resourceType();
        if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      const url = `https://www.amazon.fr/s?k=tablette+amazon&page=${currentPage}`;
      console.log(`🔄 Scraping page ${currentPage}`);
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

      const products = await page.evaluate(() => {
        const items: Product[] = [];
        const nodes = document.querySelectorAll('[data-component-type="s-search-result"]');
        nodes.forEach((node) => {
          const h2 = node.querySelector("h2");
          const name = h2?.getAttribute("aria-label") ?? null;
          const anchor = node.querySelector("a.a-link-normal.s-line-clamp-4.s-link-style.a-text-normal");
          const priceWhole = node.querySelector(".a-price-whole");
          const priceFraction = node.querySelector(".a-price-fraction");
          const rating = node.querySelector(".a-icon-alt");
          const reviewCount = node.querySelector(".a-size-base.s-underline-text");
          const imgNode = node.querySelector("img.s-image");
          const primeNode = node.querySelector(".a-icon-prime");

          items.push({
            name,
            price: priceWhole && priceFraction
              ? `${(priceWhole as HTMLElement).innerText.replace(/[^\d]/g, "")}.${(priceFraction as HTMLElement).innerText}`
              : null,
            rating: rating ? (rating as HTMLElement).innerText : null,
            reviewCount: reviewCount ? (reviewCount as HTMLElement).innerText : null,
            productUrl: anchor ? "https://www.amazon.fr" + anchor.getAttribute("href") : null,
            imageUrl: imgNode?.getAttribute("src") ?? null,
            isPrime: !!primeNode,
            type: "tablette",
          });
        });
        return items;
      });

      allProducts.push(...products);

      await page.close(); // ✅ important pour libérer la mémoire
    }

    await browser.close();

    // 🔥 Sauvegarde dans Firestore
    console.log(`✅ ${allProducts.length} produits trouvés, enregistrement...`);
    const batch = db.batch();
    const productsRef = db.collection("products");

    allProducts.forEach((product) => {
      const docRef = productsRef.doc();
      product.productUrl = formatAmazonAffiliateLink(product.productUrl ?? "", product.name ?? "");
      batch.set(docRef, {
        ...product,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log("✅ Données enregistrées avec succès !");
  }
);
*/
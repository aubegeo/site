const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const maxPages = 2;
  let currentPage = 1;
  let allProducts = [];

  while (currentPage <= maxPages) {
    const url = `https://www.amazon.fr/s?k=tablette+amazon&page=${currentPage}`;
    console.log(`🔄 Scraping page ${currentPage}...`);
    await page.goto(url, { waitUntil: "networkidle2" });

    const products = await page.evaluate(() => {
      const items = [];
      const productNodes = document.querySelectorAll('[data-component-type="s-search-result"]');

      productNodes.forEach((node) => {
        const h2 = node.querySelector("h2");
        const name = h2?.getAttribute("aria-label") ?? null;

        const anchor = node.querySelector(
          "a.a-link-normal.s-line-clamp-4.s-link-style.a-text-normal"
        );

        const priceWhole = node.querySelector(".a-price-whole");
        const priceFraction = node.querySelector(".a-price-fraction");
        const rating = node.querySelector(".a-icon-alt");
        const reviewCount = node.querySelector(".a-size-base.s-underline-text");
        const imgNode = node.querySelector("img.s-image");
        const primeNode = node.querySelector(".a-icon-prime");

        items.push({
          name: name,
          price: priceWhole && priceFraction
            ? `${priceWhole.innerText.replace(/[^\d]/g, "")}.${priceFraction.innerText}`
            : null,
          rating: rating?.innerText ?? null,
          reviewCount: reviewCount?.innerText ?? null,
          productUrl: anchor
            ? "https://www.amazon.fr" + anchor.getAttribute("href")
            : null,
          imageUrl: imgNode?.getAttribute("src") ?? null,
          isPrime: !!primeNode,
          type: "tablette",
        });
      });

      return items;
    });

    allProducts = allProducts.concat(products);
    currentPage++;
  }

  console.log(`✅ Scraping terminé. ${allProducts.length} produits récupérés.`);

  // 💾 Sauvegarde en JSON
  fs.writeFileSync("products.json", JSON.stringify(allProducts, null, 2), "utf-8");
  console.log("📁 Données enregistrées dans products.json");

  await browser.close();
})();

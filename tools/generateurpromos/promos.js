const fs = require("fs")
const path = require("path")
const readline = require("readline")

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const ask = (q) => new Promise((res) => rl.question(q, res))

async function main() {
  const title = await ask("Titre complet du produit : ")
  const description = await ask("Courte description : ")
  const prix = await ask("Prix promo (€) : ")
  const prix_original = await ask("Prix original (€) : ")
  const marque = await ask("Marque : ")
  const stockage = await ask("Stockage : ")
  const ecran = await ask("Taille écran : ")
  const systeme = await ask("Système d’exploitation : ")
  const tags = await ask("Tags (séparés par des virgules) : ")
  const lien_affilie = await ask("Lien affilié Amazon : ")
  const image = await ask("URL de l'image produit : ")
  const contenu = await ask("Description longue (copier-coller) : ")

  const slug = slugify(title)
  const date = new Date().toISOString().slice(0, 10)

  const template = fs.readFileSync("./templates/promoTemplate.md", "utf-8")

  const filled = template
    .replace(/{{ title }}/g, title)
    .replace(/{{ description }}/g, description)
    .replace(/{{ prix }}/g, prix)
    .replace(/{{ prix_original }}/g, prix_original)
    .replace(/{{ marque }}/g, marque)
    .replace(/{{ stockage }}/g, stockage)
    .replace(/{{ ecran }}/g, ecran)
    .replace(/{{ systeme }}/g, systeme)
    .replace(/{{ tags }}/g, tags.split(",").map(t => t.trim()).join("\n  - "))
    .replace(/{{ lien_affilie }}/g, lien_affilie)
    .replace(/{{ slug }}/g, slug)
    .replace(/{{ date }}/g, date)
    .replace(/{{ image }}/g, image)
    .replace(/{{ contenu }}/g, contenu)

  const outputPath = path.join("../../content/promos", `${slug}.md`)
  fs.writeFileSync(outputPath, filled)
  console.log(`✅ Fichier généré : ${outputPath}`)
  rl.close()
}

main()

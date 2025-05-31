// migrateScrappedData.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Indique à l'Admin SDK de se connecter à l'émulateur Firestore local
/// a décommmenter si vous utilisez l'émulateur local
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080"; // Assurez-vous que c'est le bon port

// Charger la clé de service Firebase (téléchargez-la depuis la Console Firebase)
const serviceAccount = require('./serviceAccountKey.json');

// Initialiser Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Chemin vers le fichier de sortie du scrapper (products.json)
const filePath = path.join(__dirname, 'products.json');

// Lecture du fichier JSON
fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error("Erreur lors de la lecture du fichier:", err);
    return;
  }

  let products;
  try {
    products = JSON.parse(data);
  } catch (parseErr) {
    console.error("Erreur lors du parsing du JSON:", parseErr);
    return;
  }

  // Référence à la collection Firestore (par exemple "tablets")
  const collectionRef = db.collection('tablets');

  // Pour chaque produit scrappé, mapper et insérer dans Firestore
  for (const product of products) {
    // Si le nom est null, on ignore ce document
    if (!product.name) {
      console.warn("Produit sans nom, ignoré:", product);
      continue;
    }
    
    const mappedProduct = {
      name: product.name, // extrait de l'attribut aria-label du h2
      // Description construite à partir de la note et du nombre d'avis (si présents)
      description: `Rating: ${product.rating || 'N/A'}, Reviews: ${product.reviewCount || 'N/A'}`,
      price: product.price || null, // Attendu déjà nettoyé, par exemple "129.90"
      link: product.productUrl || '',
      // Les autres champs ne sont pas fournis par le scrapper, on les initialise à vide
      brand: '',
      model: '',
      storage: '',
      screenSize: '',
      os: '',
      modelYear: '',
      gpu: '',
      hardwareInterface: '',
      wirelessTech: ''
    };

    try {
      await collectionRef.add(mappedProduct);
      console.log(`Document ajouté pour: ${mappedProduct.name}`);
    } catch (insertErr) {
      console.error(`Erreur lors de l'insertion pour ${mappedProduct.name}:`, insertErr);
    }
  }

  console.log("Migration terminée.");
});

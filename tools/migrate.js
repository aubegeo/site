// migrate.js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Charger la clé de service
const serviceAccount = require('./serviceAccountKey.json');

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Chemin vers le fichier de backup
const backupFilePath = path.join(__dirname, 'backup.json');

// Lire le fichier backup.json
fs.readFile(backupFilePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Erreur lors de la lecture du fichier de backup:', err);
    return;
  }

  let backupData;
  try {
    backupData = JSON.parse(data);
  } catch (parseErr) {
    console.error('Erreur de parsing JSON:', parseErr);
    return;
  }

  // Vérifier que la sauvegarde contient une collection "tablets"
  const tablets = backupData.tablets;
  if (!Array.isArray(tablets)) {
    console.error('Le fichier de backup ne contient pas de données pour la collection "tablets".');
    return;
  }

  // Migration des documents de la collection "tablets"
  for (const doc of tablets) {
    const docId = doc.id;
    const docData = doc.data;
    try {
      // Utilisation de set() pour créer ou écraser le document avec l'ID donné
      await db.collection('tablets').doc(docId).set(docData);
      console.log(`Document ${docId} migré avec succès.`);
    } catch (e) {
      console.error(`Erreur lors de la migration du document ${docId}:`, e);
    }
  }

  console.log('Migration terminée.');
});

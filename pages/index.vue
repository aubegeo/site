<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- Titre principal -->
    <h1 class="text-3xl font-bold mb-6">Blog</h1>

    <!-- Add search input at the top -->
     <div class="mb-6">
      <input
        type="search"
        v-model="searchQuery"
        placeholder="Rechercher un article..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
   
    <!-- Formulaire d'ajout ou de modification en colonne -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Section Formulaire -->
      <div v-if="isDev" class="w-full md:w-1/3 bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <h2 class="text-2xl font-bold">Ajouter une tablette</h2>
        <form @submit.prevent="submitTablet" class="space-y-4" novalidate>
          <!-- Nom (Titre interne – vous pouvez choisir de le conserver ou le mapper à un autre champ) -->
          <div>
            <input v-model="form.name" placeholder="Nom" class="input" @blur="validateName" />
            <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <input v-model="form.description" placeholder="Description" class="input" @blur="validateDescription" />
            <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
          </div>

          <!-- Prix -->
          <div>
            <input v-model.number="form.price" type="number" placeholder="Prix (€)" class="input" @blur="validatePrice" />
            <p v-if="errors.price" class="text-red-500 text-sm">{{ errors.price }}</p>
          </div>

          <!-- Lien (URL du produit) -->
          <div>
            <input v-model="form.link" placeholder="Lien (https://...)" class="input" @blur="validateLink" />
            <p v-if="errors.link" class="text-red-500 text-sm">{{ errors.link }}</p>
          </div>

          <!-- Nouveaux champs de caractéristiques -->
          <div>
            <input v-model="form.brand" placeholder="Marque (ex. Apple)" class="input" />
          </div>
          <div>
            <input v-model="form.model" placeholder="Nom de modèle (ex. iPad)" class="input" />
          </div>
          <div>
            <input v-model="form.storage" placeholder="Capacité de stockage (ex. 256 Go)" class="input" />
          </div>
          <div>
            <input v-model="form.screenSize" placeholder="Taille de l'écran (ex. 11 Pouces)" class="input" />
          </div>
          <div>
            <input v-model="form.os" placeholder="Système d'exploitation (ex. iPadOS)" class="input" />
          </div>
          <div>
            <input v-model="form.modelYear" placeholder="Année du modèle (ex. 2025)" class="input" />
          </div>
          <!-- RAM -->
          <div>
            <input v-model="form.ram" placeholder="RAM (ex. 6 Go)" class="input" />
          </div>

          <!-- Résolution d'écran -->
          <div>
            <input v-model="form.screenResolution" placeholder="Résolution d'écran (ex. 1920x1080)" class="input" />
          </div>

          <!-- Processeur -->
          <div>
            <input v-model="form.processor" placeholder="Processeur (ex. Apple M2, Snapdragon 8 Gen 1)" class="input" />
          </div>

          <!-- Connecteurs -->
          <div>
            <input v-model="form.connectors" placeholder="Connecteurs (ex. USB-C, Jack 3.5mm)" class="input" />
          </div>
          <div>
            <input v-model="form.gpu" placeholder="Fabricant GPU (ex. Apple)" class="input" />
          </div>
          <div>
            <input v-model="form.hardwareInterface" placeholder="Interface matérielle (ex. USB Type-C)" class="input" />
          </div>
          <div>
            <input v-model="form.wirelessTech" placeholder="Technologie sans fil (ex. Bluetooth, Wi-Fi)" class="input" />
          </div>

          <button  v-if="isDev" type="submit" :disabled="hasErrors" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50">
            {{ editingTablet ? 'Modifier' : 'Ajouter' }} la tablette
          </button>
        </form>
        <p v-if="error" class="text-red-600">{{ error }}</p>
      </div>

      
    <!-- Tableau d'affichage des tablettes -->
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border-collapse">
        <TabletCard 
          header
          :sort-key="sortConfig.key"
          :sort-direction="sortConfig.direction"
          @sort="handleSort"
        />
        <TabletCard
          v-for="tablet in filteredTablets"
          :key="tablet.id"
          :tablet="tablet"
          @edit="editTablet(tablet)"
          @delete="deleteTablet(tablet.id)"
        />
      </table>
    </div>
    </div>
  </div>
</template>

<script setup>
import { formatAmazonAffiliateLink } from '~/utils/amazon.ts'
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import TabletCard from '~/components/TabletCard.vue'
import { defaultMeta } from '@/utils/seo.meta'

useSeoMeta({
  title: defaultMeta.title,
  description: defaultMeta.description,
  ogTitle: defaultMeta.ogTitle,
  ogDescription: defaultMeta.ogDescription,
  ogImage: defaultMeta.ogImage,
  twitterCard: defaultMeta.twitterCard,
  ogSiteName: defaultMeta.siteName,
  robots: 'index, follow',
})
const { $db } = useNuxtApp()
const isDev = process.env.NODE_ENV === 'development'

// Définition des champs du formulaire, incluant les nouveaux champs
const form = ref({
  name: '',
  description: '',
  price: null,
  link: '',
  brand: '',
  model: '',
  storage: '',
  screenSize: '',
  os: '',
  modelYear: '',
  gpu: '',
  hardwareInterface: '',
  wirelessTech: ''
})

// Erreurs de validation pour certains champs
const errors = ref({
  name: '',
  description: '',
  price: '',
  link: ''
})

const hasErrors = computed(() =>
  Object.values(errors.value).some(e => e)
)

const editingTablet = ref(null)
const error = ref('')
const tablets = ref([])

onMounted(async () => {
  const snapshot = await getDocs(collection($db, 'tablets'))
  const allTablets = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }))

  for (const tablet of allTablets) {
    const missingFields = fieldsToCheck.filter(field => !tablet[field])
    if (!tablet.name || missingFields.length === 0) continue

    const extracted = extractInfoFromName(tablet.name)
    const updates = {}
    for (const field of missingFields) {
      if (extracted[field]) {
        updates[field] = extracted[field]
      }
    }

    if (Object.keys(updates).length > 0) {
      await updateDoc(doc($db, 'tablets', tablet.id), updates)
      console.log(`Mise à jour automatique de ${tablet.name}`, updates)
      Object.assign(tablet, updates)
    }
  }

  tablets.value = allTablets.map(doc => {
    doc.link = formatAmazonAffiliateLink(doc.link, doc.name)
    return { id: doc.id, ...doc }
  })
})

function validateName() {
  errors.value.name = form.value.name.trim() ? '' : 'Le nom est requis.'
  if (!form.value.name.trim()) return

  // Auto-remplissage à partir du nom
  const parsed = parseNomProduit(form.value.name)

  if (!form.value.brand) form.value.brand = parsed.marque
  if (!form.value.model) form.value.model = parsed.modèle
  if (!form.value.storage) form.value.storage = parsed.stockage
  if (!form.value.ram) form.value.ram = parsed.ram
  if (!form.value.screenSize) form.value.screenSize = parsed.tailleEcran
  if (!form.value.screenResolution) form.value.screenResolution = parsed.résolution
  if (!form.value.processor) form.value.processor = parsed.processeur
  if (!form.value.os) form.value.os = parsed.système
  if (!form.value.modelYear) form.value.modelYear = parsed.année?.toString() || ''
  if (!form.value.hardwareInterface) form.value.hardwareInterface = parsed.interface
  if (!form.value.wirelessTech && parsed.sansFil.length > 0) {
    form.value.wirelessTech = parsed.sansFil.join(', ')
  }
  if (!form.value.connectors && parsed.connectiques.length > 0) {
    form.value.connectors = parsed.connectiques.join(', ')
  }
}

function validateDescription() {
  errors.value.description = form.value.description.trim() ? '' : 'La description est requise.'
}

function validatePrice() {
  errors.value.price = form.value.price > 0 ? '' : 'Le prix doit être supérieur à 0.'
}

function validateLink() {
  const url = form.value.link
  if (!url) {
    errors.value.link = ''
    return
  }
  try {
    const parsed = new URL(url)
    errors.value.link = (parsed.protocol === 'http:' || parsed.protocol === 'https:') 
      ? '' 
      : 'Lien invalide (doit commencer par http:// ou https://)'
  } catch {
    errors.value.link = 'Lien invalide (doit commencer par http:// ou https://)'
  }
}

const fieldsToCheck = [
  'brand',
  'model',
  'screen_size',
  'storage',
  'os',
  'year',
  'ram',
  'screenResolution'
]

const extractInfoFromName = (name) => {
  const data = {}

  // Marque (brand) — prend le premier mot ou marque connue
  const brandMatch = name.match(/^(kwmobile|Samsung|Apple|Microsoft |Amazon|Freeski|Blackview|Lenovo|Huawei|Asus|Acer|Dell|Google|Fire|Honor)/i)
  if (brandMatch) data.brand = brandMatch[0]

  // Modèle (très simplifié)
  const modelMatch = name.match(/(iPad Pro|iPad|Galaxy Tab S\d+|Surface Go|Tab60Pro|Fire 7|Tab\s?[A-Z]?\d+)/i)
  if (modelMatch) data.model = modelMatch[0]

  // Taille d'écran (screen_size)
  const screenMatch = name.match(/(\d{1,2},?\d{0,1})["’′]?\s?(Pouces|pouce|-Pouces|")/i)
  if (screenMatch) data.screen_size = parseFloat(screenMatch[1])

// RAM : il faut absolument que "RAM" soit mentionné
const ramMatch = name.match(/(\d{1,2})\s?(Go|GB)\s?RAM/i)
if (ramMatch) data.ram = `${ramMatch[1]} Go`

// Stockage : il faut absolument que "ROM" soit mentionné
const storageMatch = name.match(/(\d{2,4})\s?(Go|GB)\s?ROM/i)
if (storageMatch) data.storage = `${storageMatch[1]} Go`

  // OS
  if (/Android/i.test(name)) data.os = 'Android'
  if (/iPad|iOS/i.test(name)) data.os = 'iOS'
  if (/Windows|Surface/i.test(name)) data.os = 'Windows'

  // Année
  const yearMatch = name.match(/\b(20[1-3][0-9])\b/)
  if (yearMatch) data.year = parseInt(yearMatch[1])

  const resolutionMatch = name.match(/\b(\d{3,4})x(\d{3,4})\b/)
  if (resolutionMatch) data.screenResolution = `${resolutionMatch[1]}x${resolutionMatch[2]}`
  else if (/Full\s?HD/i.test(name)) data.screenResolution = '1920x1080'
  else if (/HD/i.test(name)) data.screenResolution = '1280x720'

  return data
}

async function submitTablet() {
  // Valider les champs requis
  validateName()
  validateDescription()
  validatePrice()
  validateLink()

  if (hasErrors.value) return

  const tabletData = { ...form.value }

  // Ajout ou modification : ajout du tag d'affiliation si c'est un lien Amazon
  tabletData.link = formatAmazonAffiliateLink(tabletData.link)

  // On ajoute ou on met à jour
  if (editingTablet.value) {
    // Modification
    const docRef = doc($db, 'tablets', editingTablet.value.id)
    await updateDoc(docRef, tabletData)
    const index = tablets.value.findIndex(t => t.id === editingTablet.value.id)
    tablets.value[index] = { id: editingTablet.value.id, ...tabletData }
  } else {
    // Ajout
    const col = collection($db, 'tablets')
    const docRef = await addDoc(col, tabletData)
    tablets.value.push({ id: docRef.id, ...tabletData })
  }

  // Réinitialisation du formulaire et de l'état d'édition
  form.value = {
    name: '',
    model: '',
    description: '',
    price: null,
    link: '',
    brand: '',
    storage: '',
    screenSize: '',
    os: '',
    modelYear: '',
    gpu: '',
    hardwareInterface: '',
    wirelessTech: '',
    ram: ''
  }
  editingTablet.value = null
}

async function deleteTablet(id) {
  const docRef = doc($db, 'tablets', id)
  await deleteDoc(docRef)
  tablets.value = tablets.value.filter(t => t.id !== id)
}

function editTablet(tablet) {
  form.value = { ...tablet }
  editingTablet.value = tablet
}

function parseNomProduit(nom) {
  const result = {
    marque: '',
    modèle: '',
    stockage: '',
    ram: '',
    tailleEcran: '',
    résolution: '',
    processeur: '',
    système: '',
    année: '',
    gpu: '',
    interface: '',
    sansFil: [],
    connectiques: [],
  }

  const marquesConnues = ['Apple', 'Samsung', 'Amazon', 'Lenovo', 'Microsoft', 'Xiaomi', 'HONOR', 'Kindle', 'Acer', 'Huawei', 'OSCAL', 'TECLAST', 'UMIDIGI', 'TIGERFU']
  for (const marque of marquesConnues) {
    if (nom.toLowerCase().includes(marque.toLowerCase())) {
      result.marque = marque
      break
    }
  }

  const tailleMatch = nom.match(/(\d{1,2},?\d{0,1})["’′]?\s?(Pouces|pouce|")/i)
  if (tailleMatch) result.tailleEcran = tailleMatch[1].replace(',', '.')

  const stockageMatch = nom.match(/(\d{2,4})\s?Go(?!\s*RAM)/i)
  if (stockageMatch) result.stockage = `${stockageMatch[1]} Go`

  const ramMatch = nom.match(/(\d{1,2})\s?(Go|GB)\s?(RAM)?/i)
  if (ramMatch) result.ram = `${ramMatch[1]} Go`

  const systemMatch = nom.match(/Android\s?\d{1,2}|iOS\s?\d{1,2}|iPadOS\s?\d{1,2}|Windows\s?\d{1,2}/i)
  if (systemMatch) result.système = systemMatch[0]

  const yearMatch = nom.match(/\b(20[1-3][0-9])\b/)
  if (yearMatch) result.année = parseInt(yearMatch[1])

  const resolutionMatch = nom.match(/\b(\d{3,4})x(\d{3,4})\b/)
  if (resolutionMatch) result.résolution = `${resolutionMatch[1]}x${resolutionMatch[2]}`
  else if (/Full\s?HD/i.test(nom)) result.résolution = '1920x1080'
  else if (/HD/i.test(nom)) result.résolution = '1280x720'

  const cpuMatch = nom.match(/(Snapdragon\s?\d{3,4}|MediaTek\s?\w+|Apple\s?(M1|M2|A\d+)|Intel\s?(Celeron|Atom|Core\s?\w+)|RK\d+)/i)
  if (cpuMatch) result.processeur = cpuMatch[0]

  if (/Wi[-]?Fi\s?6/i.test(nom)) result.sansFil.push('Wi-Fi 6')
  if (/5G/i.test(nom)) result.sansFil.push('5G')
  if (/4G|LTE/i.test(nom)) result.sansFil.push('4G')
  if (/Bluetooth\s?(\d(\.\d)?)/i.test(nom)) result.sansFil.push(nom.match(/Bluetooth\s?(\d(\.\d)?)/i)[0])

  if (/clavier/i.test(nom)) result.interface = 'Clavier'
  if (/stylet/i.test(nom)) result.interface += (result.interface ? ', ' : '') + 'Stylet'
  if (/souris/i.test(nom)) result.interface += (result.interface ? ', ' : '') + 'Souris'

  if (/USB[-\s]?C/i.test(nom)) result.connectiques.push('USB-C')
  if (/Jack/i.test(nom)) result.connectiques.push('Jack 3.5mm')
  if (/HDMI/i.test(nom)) result.connectiques.push('HDMI')

  result.modèle = nom

  return result
}

// Ajoutez après la déclaration des refs existantes
const sortConfig = ref({
  key: 'name',
  direction: 'asc'
})

// Add search functionality
const searchQuery = ref('')

// Add computed property for filtered tablets
const filteredTablets = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  
  // First filter by search query
  const filtered = sortedTablets.value.filter(tablet => {
    return (
      tablet.name?.toLowerCase().includes(query) ||
      tablet.description?.toLowerCase().includes(query) ||
      tablet.brand?.toLowerCase().includes(query) ||
      tablet.model?.toLowerCase().includes(query) ||
      tablet.os?.toLowerCase().includes(query) ||
      tablet.storage?.toLowerCase().includes(query) ||
      tablet.processor?.toLowerCase().includes(query) ||
      tablet.ram?.toLowerCase().includes(query) ||
      String(tablet.price)?.includes(query)
    )
  })

  // Then sort by price in descending order
  return filtered.sort((a, b) => {
    const priceA = Number(a.price) || 0
    const priceB = Number(b.price) || 0
    return priceB - priceA // Prix décroissant (du plus cher au moins cher)
  })
})

// Ajoutez cette fonction de tri
const sortedTablets = computed(() => {
  return [...tablets.value].sort((a, b) => {
    const aValue = a[sortConfig.value.key]
    const bValue = b[sortConfig.value.key]
    
    // Handle numeric values
    if (sortConfig.value.key === 'price' || sortConfig.value.key === 'modelYear') {
      return sortConfig.value.direction === 'asc' 
        ? Number(aValue || 0) - Number(bValue || 0)
        : Number(bValue || 0) - Number(aValue || 0)
    }
    
    // Handle string values
    const aString = String(aValue || '').toLowerCase()
    const bString = String(bValue || '').toLowerCase()
    
    return sortConfig.value.direction === 'asc' 
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString)
  })
})

function handleSort(key) {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value.key = key
    sortConfig.value.direction = 'asc'
  }
}

</script>

<style scoped>
/* Add transition for smooth filtering */
.table-auto tr {
  transition: all 0.3s ease;
}
.input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400;
}
</style>

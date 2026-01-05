import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

// Mock products with categories for development/fallback
const mockProducts = [
  {
    "id": "1",
    "title": "Bouquet de Roses Rouges",
    "price": 299.00,
    "description": "Un magnifique bouquet de 12 roses rouges fraîches, symbole d'amour et de passion.",
    "category": "fleurs",
    "image": "https://i0.wp.com/exflora.ma/wp-content/uploads/2018/07/2wcihaw.gif?fit=500%2C667&ssl=1"
  },
  {
    "id": "2",
    "title": "Bouquet Tulipes Colorées",
    "price": 199.00,
    "description": "Un ensemble vibrant de tulipes multicolores pour égayer votre journée.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/207962/pexels-photo-207962.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "3",
    "title": "Bouquet de Tournesols",
    "price": 179.00,
    "description": "Des tournesols lumineux qui apportent le soleil dans votre maison.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "4",
    "title": "Orchidée Phalaenopsis",
    "price": 350.00,
    "description": "Une élégante orchidée blanche dans un pot décoratif.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/1021703/pexels-photo-1021703.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "5",
    "title": "Bouquet Mixte Printanier",
    "price": 249.00,
    "description": "Un assortiment de fleurs de saison aux couleurs vives.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "16",
    "title": "Pivoines Rose Poudré",
    "price": 320.00,
    "description": "Bouquet luxueux de pivoines fraîches, symbole de romance.",
    "category": "fleurs",
    "image": "https://i.pinimg.com/474x/28/62/10/286210657231f1b862552e2d75b14223.jpg"
  },
  {
    "id": "17",
    "title": "Lys Blanc Élégant",
    "price": 270.00,
    "description": "Bouquet de lys blancs purs, parfait pour toute occasion.",
    "category": "fleurs",
    "image": "https://fleuriste-marrakech.com/wp-content/uploads/2024/09/Lys-blanc.png"
  },
  {
    "id": "18",
    "title": "Roses Blanches Premium",
    "price": 310.00,
    "description": "Bouquet raffiné de 15 roses blanches longues tiges.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/1470589/pexels-photo-1470589.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "19",
    "title": "Composition Florale Exotique",
    "price": 390.00,
    "description": "Arrangement unique de fleurs tropicales colorées.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/992734/pexels-photo-992734.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "20",
    "title": "Bouquet Champêtre",
    "price": 189.00,
    "description": "Composition rustique de fleurs des champs fraîches.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/2058499/pexels-photo-2058499.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "21",
    "title": "Hortensias Bleus",
    "price": 260.00,
    "description": "Magnifiques hortensias bleus dans un vase élégant.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/1131407/pexels-photo-1131407.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "22",
    "title": "Gerberas Multicolores",
    "price": 169.00,
    "description": "Bouquet joyeux de gerberas aux couleurs vives.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/1109561/pexels-photo-1109561.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "23",
    "title": "Freesias Parfumés",
    "price": 210.00,
    "description": "Délicats freesias au parfum enivrant.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/1083895/pexels-photo-1083895.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "24",
    "title": "Dahlia Garden",
    "price": 240.00,
    "description": "Composition élégante de dahlias en nuances pastels.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "25",
    "title": "Anémones Délicates",
    "price": 195.00,
    "description": "Bouquet raffiné d'anémones blanches et roses.",
    "category": "fleurs",
    "image": "https://images.pexels.com/photos/569354/pexels-photo-569354.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "6",
    "title": "Coffret Chocolats Assortis",
    "price": 189.00,
    "description": "Sélection de 24 chocolats fins artisanaux aux saveurs variées.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "7",
    "title": "Truffes au Chocolat Noir",
    "price": 149.00,
    "description": "Truffes onctueuses enrobées de cacao pur 70%.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/4110006/pexels-photo-4110006.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "8",
    "title": "Boîte Pralinés Luxe",
    "price": 229.00,
    "description": "Pralinés au chocolat au lait avec éclats de noisettes.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/4110005/pexels-photo-4110005.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "9",
    "title": "Tablette Chocolat Artisanal",
    "price": 89.00,
    "description": "Tablette de chocolat noir 85% origine Madagascar.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/4109789/pexels-photo-4109789.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "26",
    "title": "Mendiant Gourmand",
    "price": 119.00,
    "description": "Chocolats aux fruits secs et fruits confits premium.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/1998634/pexels-photo-1998634.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "27",
    "title": "Rochers Coco",
    "price": 99.00,
    "description": "Délicieux rochers chocolat-coco fait maison.",
    "category": "chocolats",
    "image": "https://assets.afcdn.com/recipe/20181017/82809_w600.jpg"
  },
  {
    "id": "28",
    "title": "Orangettes Confites",
    "price": 139.00,
    "description": "Écorces d'orange enrobées de chocolat noir.",
    "category": "chocolats",
    "image": "https://www.lesfleurons-apt.com/img/cms/Orangettes.jpg"
  },
  {
    "id": "29",
    "title": "Mendiants Fruits Secs",
    "price": 129.00,
    "description": "Assortiment de mendiants aux amandes et noisettes.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/4110103/pexels-photo-4110103.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "30",
    "title": "Chocolats Belges",
    "price": 259.00,
    "description": "Coffret prestige de chocolats belges authentiques.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "31",
    "title": "Amandes Chocolatées",
    "price": 109.00,
    "description": "Amandes grillées enrobées de chocolat au lait.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/3923555/pexels-photo-3923555.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "32",
    "title": "Pavé de Ganache",
    "price": 179.00,
    "description": "Ganache pure au chocolat grand cru.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/4110109/pexels-photo-4110109.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "33",
    "title": "Calissons Chocolat",
    "price": 159.00,
    "description": "Calissons traditionnels enrobés de chocolat.",
    "category": "chocolats",
    "image": "https://turbigo-gourmandises.fr/wp-content/uploads/2022/12/calissons-marrons-et-chocolat.jpg"
  },
  {
    "id": "34",
    "title": "Nougat Enrobé",
    "price": 145.00,
    "description": "Nougat tendre recouvert de chocolat noir.",
    "category": "chocolats",
    "image": "https://images.pexels.com/photos/4110101/pexels-photo-4110101.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "10",
    "title": "Gâteau Fraisier Deluxe",
    "price": 280.00,
    "description": "Délicieux gâteau aux fraises fraîches et crème mousseline.",
    "category": "gateaux",
    "image": "https://images.pexels.com/photos/461431/pexels-photo-461431.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "11",
    "title": "Tarte Citron Meringuée",
    "price": 199.00,
    "description": "Tarte acidulée au citron avec meringue dorée.",
    "category": "gateaux",
    "image": "https://images.pexels.com/photos/4686817/pexels-photo-4686817.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "12",
    "title": "Gâteau Chocolat Fondant",
    "price": 320.00,
    "description": "Gâteau au chocolat fondant avec cœur coulant.",
    "category": "gateaux",
    "image": "https://images.pexels.com/photos/4553363/pexels-photo-4553363.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "13",
    "title": "Macarons Assortis (12 pcs)",
    "price": 159.00,
    "description": "Boîte de 12 macarons aux parfums variés.",
    "category": "gateaux",
    "image": "https://images.pexels.com/photos/239578/pexels-photo-239578.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "14",
    "title": "Wedding Cake 3 Étages",
    "price": 890.00,
    "description": "Gâteau de mariage élégant sur 3 étages personnalisable.",
    "category": "gateaux",
    "image": "https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "15",
    "title": "Cheesecake New York",
    "price": 220.00,
    "description": "Authentique cheesecake crémeux avec coulis de fruits rouges.",
    "category": "gateaux",
    "image": "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "35",
    "title": "Opéra Parisien",
    "price": 290.00,
    "description": "Classique pâtisserie française au café et chocolat.",
    "category": "gateaux",
    "image": "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "36",
    "title": "Forêt Noire",
    "price": 270.00,
    "description": "Gâteau chocolat-cerise avec chantilly généreuse.",
    "category": "gateaux",
    "image": "https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "37",
    "title": "Millefeuille Vanille",
    "price": 199.00,
    "description": "Millefeuille traditionnel à la crème vanille.",
    "category": "gateaux",
    "image": "https://files.meilleurduchef.com/mdc/photo/recette/millefeuille-vanille/millefeuille-vanille-640.jpg"
  },
  {
    "id": "38",
    "title": "Éclair au Café",
    "price": 89.00,
    "description": "Éclair garni de crème au café onctueuse.",
    "category": "gateaux",
    "image": "https://images.pexels.com/photos/372851/pexels-photo-372851.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "39",
    "title": "Tiramisu Maison",
    "price": 189.00,
    "description": "Tiramisu traditionnel italien fait maison.",
    "category": "gateaux",
    "image": "https://www.marmiton.org/recettes/recette_tiramisu-rapide_14796.aspx#d110446-p1"
  },
  {
    "id": "40",
    "title": "Profiteroles Chocolat",
    "price": 169.00,
    "description": "Choux garnis de glace vanille, sauce chocolat chaud.",
    "category": "gateaux",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm6yZRvK7X12_g6z-ZR9MKiD4iK-QfGYTsGw&s"
  },
];

// Flag to use Firestore or mock data
const USE_FIRESTORE = false; // Set to true when Firestore is populated

export async function getProducts(category = null) {
  try {
    if (USE_FIRESTORE && db) {
      let q = collection(db, 'products');
      
      if (category) {
        q = query(collection(db, 'products'), where('category', '==', category));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
  } catch (error) {
    console.error('Firestore error, falling back to mock data:', error);
  }
  
  // Return mock data (filtered by category if specified)
  if (category) {
    return mockProducts.filter((p) => p.category === category);
  }
  return mockProducts;
}

export async function getProductById(id) {
  try {
    if (USE_FIRESTORE && db) {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    }
  } catch (error) {
    console.error('Firestore error, falling back to mock data:', error);
  }
  
  return mockProducts.find((p) => p.id === id);
}

export async function getProductsByCategory(category) {
  return getProducts(category);
}

export async function searchProducts(queryText) {
  const allProducts = await getProducts();
  const lowerQuery = queryText.toLowerCase();
  
  return allProducts.filter(
    (p) =>
      p.title?.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
  );
}

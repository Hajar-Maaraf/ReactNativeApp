<p align="center">
  <img src="assets/icon.png" alt="SweetBloom Logo" width="120" height="120" />
</p>

<h1 align="center">🌸 SweetBloom</h1>

<p align="center">
  <strong>A beautiful React Native (Expo) e-commerce app for sweet treats and blooming delights</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</p>

---

## ✨ Features

- 🔐 **Authentication** — Login & Registration with Firebase
- 🛍️ **Product Catalog** — Browse and search products
- 🛒 **Shopping Cart** — Add items and manage your cart
- ❤️ **Favorites** — Save your favorite products
- 📦 **Order History** — Track your orders
- 👤 **User Profile** — Manage your account settings

---

## 📁 Project Structure

```
SweetBloom/
├── 📄 App.js                    # App entry point
├── 📄 index.js                  # Expo entry
├── 📄 package.json
├── 📁 assets/                   # Images, fonts, icons
└── 📁 src/
    ├── 📁 components/           # Reusable UI components
    │   ├── Button.js
    │   ├── FeaturedProducts.js
    │   ├── Input.js
    │   ├── LoadingSpinner.js
    │   ├── ProductCard.js
    │   ├── PromoBanner.js
    │   └── QuickActions.js
    │
    ├── 📁 contexts/             # React Context providers
    │   ├── AuthContext.js
    │   └── CartContext.js
    │
    ├── 📁 navigation/           # Navigation configuration
    │   ├── AuthStack.js         # Auth flow screens
    │   ├── AppTabs.js           # Main tab navigator
    │   └── index.js             # Root navigator
    │
    ├── 📁 screens/              # App screens
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── CatalogScreen.js
    │   ├── ProductDetailScreen.js
    │   ├── CartScreen.js
    │   ├── FavoritesScreen.js
    │   ├── OrdersScreen.js
    │   ├── ProfileScreen.js
    │   ├── SearchScreen.js
    │   ├── ContactScreen.js
    │   └── ...
    │
    ├── 📁 services/             # API & Backend services
    │   ├── firebase.js          # Firebase configuration
    │   └── productsApi.js       # Products API
    │
    └── 📁 utils/                # Utility functions
        └── favorites.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator / Android Emulator / Physical device with Expo Go

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SweetBloom.git
   cd SweetBloom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install required peer dependencies**
   ```bash
   npx expo install expo-font react-native-safe-area-context react-native-screens
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### 📱 Run on Device

| Platform | Command |
|----------|---------|
| 📱 Android | `npm run android` |
| 🍎 iOS | `npm run ios` |
| 🌐 Web | `npm run web` |

---

## 📦 Dependencies

### Core Navigation
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
```

### Required Peer Dependencies
```bash
npx expo install expo-font react-native-safe-area-context react-native-screens
```

### Optional: Firebase Backend
```bash
npm install firebase
```

---

## 🔧 Troubleshooting

### ❌ Missing Peer Dependencies

If `npx expo-doctor` shows errors like:

```
✖ Check that required peer dependencies are installed
  Missing peer dependency: expo-font
  Missing peer dependency: react-native-safe-area-context
  Missing peer dependency: react-native-screens
```

**Fix it by running:**
```bash
npx expo install expo-font react-native-safe-area-context react-native-screens
```

<details>
<summary>📋 Why are these needed?</summary>

| Dependency | Required By |
|------------|-------------|
| `expo-font` | `@expo/vector-icons` |
| `react-native-safe-area-context` | `@react-navigation/bottom-tabs`, `@react-navigation/native-stack` |
| `react-native-screens` | `@react-navigation/bottom-tabs`, `@react-navigation/native-stack` |

> ⚠️ **Warning:** Your app may crash outside of Expo Go without these dependencies!

</details>

### 🔥 Firebase Configuration

To enable Firebase features:

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Add your config to `src/services/firebase.js`
3. Enable Authentication and Firestore in your Firebase project

---

## 📝 Notes

- 🎯 Auth and product services use placeholders — replace with real Firebase logic as needed
- 🛡️ This scaffold focuses on structure and safe defaults to prevent crashes
- 📱 Optimized for mobile-first experience

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ and ☕
</p>

import 'dotenv/config';

export default {
  expo: {
    name: "Sabor da Casa - Vendedor",
    slug: "sabor-da-casa-vendedor",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ff5722"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ff5722"
      },
      package: "com.sabordacasa.vendedor"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sabordacasa.vendedor"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-asset",
      "expo-font"
    ],
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    }
  }
};

import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

import App from './App';

// Supprimer les avertissements connus de react-native-web avant tout chargement
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  '"textShadow*" style props are deprecated',
  '"shadow*" style props are deprecated',
  'Animated: `useNativeDriver` is not supported',
  'Cannot record touch end without a touch start',
]);

// Supprimer les avertissements de console pour les problèmes connus de react-native-web
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('textShadow*') ||
     message.includes('shadow*') ||
     message.includes('pointerEvents') ||
     message.includes('useNativeDriver') ||
     message.includes('touch end without a touch start'))
  ) {
    return;
  }
  originalWarn(...args);
};

// registerRootComponent appelle AppRegistry.registerComponent('main', () => App);
// Il s'assure également que, que vous chargiez l'application dans Expo Go ou dans une build native,
// l'environnement est correctement configuré
registerRootComponent(App);

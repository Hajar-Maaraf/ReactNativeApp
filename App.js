import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import Navigation from './src/navigation';
import { LogBox } from 'react-native';

// Suppress specific warnings for react-native-web
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  '"textShadow*" style props are deprecated',
  '"shadow*" style props are deprecated',
  'Animated: `useNativeDriver` is not supported',
  'Cannot record touch end without a touch start',
]);

// Suppress console warnings for known react-native-web issues
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

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

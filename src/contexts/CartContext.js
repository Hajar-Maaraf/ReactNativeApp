import React, { createContext, useReducer } from 'react';

export const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((p) => p.id === action.product.id);
      if (existing) {
        return state.map((p) =>
          p.id === action.product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...state, { ...action.product, qty: 1 }];
    } 
    case 'DECREMENT': {
      const existing = state.find((p) => p.id === action.id);
      if (existing && existing.qty > 1) {
        return state.map((p) =>
          p.id === action.id ? { ...p, qty: p.qty - 1 } : p
        );
      }
      // Si qty === 1, on retire l'article
      return state.filter((p) => p.id !== action.id);
    }
    case 'REMOVE':
      return state.filter((p) => p.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => dispatch({ type: 'ADD', product });
  const decrementFromCart = (id) => dispatch({ type: 'DECREMENT', id });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', id });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider value={{ cart, addToCart, decrementFromCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

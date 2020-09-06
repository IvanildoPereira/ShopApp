import { createContext } from 'react';

export const CartContext = createContext({
    cart: null,
    length: 0,
    loadingCart: false
});
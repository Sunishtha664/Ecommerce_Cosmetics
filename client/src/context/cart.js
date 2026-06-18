import { useState, useContext, createContext } from 'react';
import axios from 'axios';

const CartContext = createContext();


const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    return (
        <CartContext.Provider value={[cart, setCart]}>
            {children}
        </CartContext.Provider>
    );
}

//custom hook
const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
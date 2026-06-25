import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
export const CartContext = createContext();
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];    });
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
    const addToCart = (product) => {
        const existing = cart.find(item => item._id === product._id);
        if (existing) {
            toast.error(`${product.name} already in bucket! 🍟`);
            return;}
        setCart([...cart, { ...product, qty: 1 }]);
        toast.success(`${product.name} added to bucket! 🎉`);};
    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
        toast.success("Item removed from bucket");};
    const updateQty = (id, amount) => {
        setCart(cart.map(item => 
            item._id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + amount) } : item));};
    const clearCart = () => setCart([]);
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};

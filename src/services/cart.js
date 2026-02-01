const CART_KEY = "cart";

export const CartService = {
    getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    },

    addItem(product) {
        const cart = this.getCart();
        // Check if item exists to just increase quantity (optional, but good UX)
        // For simplicity based on prompt requirements, we can just push pending clarity,
        // but I'll implement basic quantity logic for a better app.
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        this.saveCart(cart);
    },

    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter((item) => item.id !== productId);
        this.saveCart(cart);
    },

    increaseQuantity(productId) {
        const cart = this.getCart();
        const item = cart.find((i) => i.id === productId);
        if (item) {
            item.quantity = (item.quantity || 1) + 1;
            this.saveCart(cart);
        }
    },

    decreaseQuantity(productId) {
        const cart = this.getCart();
        const item = cart.find((i) => i.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Remove if 1
                return this.removeItem(productId);
            }
            this.saveCart(cart);
        }
    },

    clearCart() {
        localStorage.removeItem(CART_KEY);
    },

    saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    },

    getTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    },
};

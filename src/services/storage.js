import db from "../db.json";

const KEYS = {
    USERS: "users",
    PRODUCTS: "products",
    ORDERS: "orders",
    SESSION: "loggedUser",
};

export const StorageService = {
    init() {
        if (!localStorage.getItem(KEYS.USERS)) {
            localStorage.setItem(KEYS.USERS, JSON.stringify(db.users));
        }
        if (!localStorage.getItem(KEYS.PRODUCTS)) {
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(db.products));
        }
        if (!localStorage.getItem(KEYS.ORDERS)) {
            localStorage.setItem(KEYS.ORDERS, JSON.stringify(db.orders));
        }
    },

    // Users
    getUsers() {
        return JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
    },

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find((u) => u.email === email);
    },

    // Products
    getProducts() {
        return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || "[]");
    },

    // Orders
    getOrders() {
        return JSON.parse(localStorage.getItem(KEYS.ORDERS) || "[]");
    },

    saveOrder(order) {
        const orders = this.getOrders();
        orders.push(order);
        localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    },

    updateOrder(updatedOrder) {
        const orders = this.getOrders();
        const index = orders.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
            orders[index] = updatedOrder;
            localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
        }
    },

    // Session
    getSession() {
        return JSON.parse(localStorage.getItem(KEYS.SESSION));
    },

    setSession(user) {
        localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
    },

    clearSession() {
        localStorage.removeItem(KEYS.SESSION);
    },
};

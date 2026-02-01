import { StorageService } from "./storage.js";

export const OrderService = {
    createOrder(userId, items, total) {
        const newOrder = {
            id: Date.now(), // Simple unique ID
            userId,
            items,
            total,
            status: "pending", // Default status
            createdAt: new Date().toISOString(),
        };
        StorageService.saveOrder(newOrder);
        return newOrder;
    },

    getAllOrders() {
        return StorageService.getOrders();
    },

    getOrdersByUser(userId) {
        const orders = this.getAllOrders();
        return orders.filter((order) => order.userId === userId);
    },

    updateOrderStatus(orderId, newStatus) {
        const orders = this.getAllOrders();
        const order = orders.find((o) => o.id === parseInt(orderId) || o.id === orderId);

        if (order) {
            order.status = newStatus;
            StorageService.updateOrder(order);
            return true;
        }
        return false;
    },

    // Helper to get status color/class if needed here or in UI
    getStatusColor(status) {
        switch (status) {
            case "pending": return "orange";
            case "preparing": return "blue";
            case "delivered": return "green";
            default: return "gray";
        }
    }
};

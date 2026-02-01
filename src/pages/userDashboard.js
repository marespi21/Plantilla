import { AuthService } from "../services/auth.js";
import { StorageService } from "../services/storage.js";
import { CartService } from "../services/cart.js";
import { OrderService } from "../services/orders.js";
import { navigateTo } from "../main.js";

export function renderUserDashboard(container) {
    const user = AuthService.getCurrentUser();

    container.innerHTML = `
        <header class="navbar">
            <div class="brand">Riwi Eats</div>
            <nav>
                <span>Hello, ${user.name}</span>
                <button onclick="window.navigateTo('/profile')" class="btn-text" style="margin-right:10px">Profile</button>
                <button id="logout-btn" class="btn-sm">Logout</button>
            </nav>
        </header>
        
        <div class="dashboard-container">
            <section class="menu-section">
                <h2>Menu</h2>
                <div id="product-list" class="product-grid">Loading...</div>
            </section>
            
            <aside class="sidebar-section">
                <div class="cart-box">
                    <h2>Your Cart</h2>
                    <div id="cart-items"></div>
                    <div class="cart-total">
                        <strong>Total: $<span id="cart-total-amount">0</span></strong>
                    </div>
                    <button id="checkout-btn" class="btn-primary full-width">Confirm Order</button>
                </div>
                
                <div class="orders-box">
                    <h2>My Orders</h2>
                    <div id="orders-list" class="orders-list"></div>
                </div>
            </aside>
        </div>
    `;

    // Events
    document.getElementById("logout-btn").addEventListener("click", () => {
        AuthService.logout();
        navigateTo("/login");
    });

    document.getElementById("checkout-btn").addEventListener("click", handleCheckout);

    // Initial Renders
    renderProducts();
    updateCartUI();
    renderMyOrders();
}

function renderProducts() {
    const products = StorageService.getProducts();
    const productList = document.getElementById("product-list");

    productList.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-info">
                <h3>${p.name}</h3>
                <span class="category-badge">${p.category}</span>
                <p class="price">$${p.price}</p>
            </div>
            <button class="add-to-cart-btn btn-secondary" data-id="${p.id}">Add</button>
        </div>
    `).join("");

    // Add event listeners using delegation or directly
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === id);
            CartService.addItem(product);
            updateCartUI();
        });
    });
}

function updateCartUI() {
    const cart = CartService.getCart();
    const cartContainer = document.getElementById("cart-items");
    const totalSpan = document.getElementById("cart-total-amount");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p class='empty-msg'>Your cart is empty</p>";
        totalSpan.textContent = "0";
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span>${item.name}</span>
                <small>$${item.price} x ${item.quantity}</small>
            </div>
            <div class="cart-controls">
                <button class="qty-btn" onclick="window.dispatchCartEvent('decrease', ${item.id})">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="window.dispatchCartEvent('increase', ${item.id})">+</button>
                <button class="remove-btn" onclick="window.dispatchCartEvent('remove', ${item.id})">&times;</button>
            </div>
        </div>
    `).join("");

    totalSpan.textContent = CartService.getTotal();
}

// Quick hack to handle inline onclick events in module scope
window.dispatchCartEvent = (action, id) => {
    if (action === 'increase') CartService.increaseQuantity(id);
    if (action === 'decrease') CartService.decreaseQuantity(id);
    if (action === 'remove') CartService.removeItem(id);
    updateCartUI();
};

function handleCheckout() {
    const cart = CartService.getCart();
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const user = AuthService.getCurrentUser();
    const total = CartService.getTotal();

    OrderService.createOrder(user.id, cart, total);
    CartService.clearCart();

    updateCartUI();
    renderMyOrders();
    alert("Order placed successfully!");
}

function renderMyOrders() {
    const user = AuthService.getCurrentUser();
    const orders = OrderService.getOrdersByUser(user.id);
    const container = document.getElementById("orders-list");

    if (orders.length === 0) {
        container.innerHTML = "<p class='empty-msg'>No orders yet.</p>";
        return;
    }

    // Reverse to show newest first
    container.innerHTML = [...orders].reverse().map(order => `
        <div class="order-card ${order.status}">
            <div class="order-header">
                <strong>Order #${order.id}</strong>
                <span class="status-badge ${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <small>${new Date(order.createdAt).toLocaleString()}</small>
                <p>Total: $${order.total}</p>
            </div>
        </div>
    `).join("");
}

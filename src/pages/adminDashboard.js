import { AuthService } from "../services/auth.js";
import { OrderService } from "../services/orders.js";
import { navigateTo } from "../main.js";

export function renderAdminDashboard(container) {
    const user = AuthService.getCurrentUser();

    container.innerHTML = `
        <header class="navbar admin">
            <div class="brand">Riwi Eats [ADMIN]</div>
            <nav>
                <span>Hello, ${user.name}</span>
                <button id="logout-btn" class="btn-sm">Logout</button>
            </nav>
        </header>
        
        <div class="dashboard-container">
            <div class="admin-header">
                <h2>Manage Orders</h2>
                <div class="filters">
                    <label>Filter by Status:</label>
                    <select id="status-filter">
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="preparando">Preparing</option>
                        <option value="listo">Ready</option>
                        <option value="entregado">Delivered</option>
                    </select>
                </div>
            </div>
            
            <div id="admin-orders-list" class="admin-orders-grid">Loading...</div>
        </div>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
        AuthService.logout();
        navigateTo("/login");
    });

    const filterSelect = document.getElementById("status-filter");
    filterSelect.addEventListener("change", (e) => {
        renderOrders(e.target.value);
    });

    renderOrders();
}

function renderOrders(filter = "all") {
    const allOrders = OrderService.getAllOrders();
    let orders = allOrders;

    if (filter !== "all") {
        orders = allOrders.filter(o => o.status === filter);
    }

    const container = document.getElementById("admin-orders-list");

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders found.</p>";
        return;
    }

    // Sort by pending first, then by date logic usually, but here just reverse ID/Date
    orders.sort((a, b) => b.id - a.id);

    container.innerHTML = orders.map(order => `
        <div class="admin-order-card">
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="status-badge ${order.status}">${order.status}</span>
            </div>
            <p><strong>User ID:</strong> ${order.userId}</p>
            <p><strong>Total:</strong> $${order.total}</p>
            <ul class="order-items-list">
                ${order.items.map(i => `<li>${i.name} x ${i.quantity}</li>`).join("")}
            </ul>
            
            <div class="order-actions">
                ${renderStatusButtons(order)}
            </div>
        </div>
    `).join("");
}

function renderStatusButtons(order) {
    // pending -> preparando -> listo -> entregado
    const current = order.status;
    let nextAction = "";
    let btnLabel = "";

    if (current === "pending") {
        nextAction = "preparando";
        btnLabel = "Mark as Preparing";
    } else if (current === "preparando") {
        nextAction = "listo";
        btnLabel = "Mark as Ready";
    } else if (current === "listo") {
        nextAction = "entregado";
        btnLabel = "Mark as Delivered";
    } else {
        return "<span class='completed-text'>Order Completed</span>";
    }

    return `<button class="status-btn" onclick="window.updateStatus(${order.id}, '${nextAction}')">${btnLabel}</button>`;
}

window.updateStatus = (orderId, newStatus) => {
    OrderService.updateOrderStatus(orderId, newStatus);
    // Re-render
    const filter = document.getElementById("status-filter").value;
    renderOrders(filter);
}; // Make sure this is exported/attached properly
window.renderOrders = renderOrders; // Ensure it's available if needed RECURSIVELY, but here we just need updateStatus

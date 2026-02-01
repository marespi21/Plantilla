import { AuthService } from "../services/auth.js";
import { OrderService } from "../services/orders.js";
import { navigateTo } from "../main.js";

export function renderProfile(container) {
    const user = AuthService.getCurrentUser();
    const orders = OrderService.getOrdersByUser(user.id);
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    container.innerHTML = `
        <header class="navbar">
            <div class="brand">Riwi Eats</div>
            <nav>
                <button onclick="window.navigateTo('/dashboard')" class="btn-text">Back to Dashboard</button>
                <button id="logout-btn" class="btn-sm">Logout</button>
            </nav>
        </header>
        
        <div class="profile-container">
            <div class="profile-card">
                <div class="profile-avatar">
                   ${user.name.charAt(0).toUpperCase()}
                </div>
                <h2>${user.name}</h2>
                <p class="role-badge">${user.role}</p>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${orders.length}</span>
                        <span class="stat-label">Orders</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">$${totalSpent.toLocaleString()}</span>
                        <span class="stat-label">Total Spent</span>
                    </div>
                </div>
                
                <div class="profile-details">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>User ID:</strong> ${user.id}</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
        AuthService.logout();
        navigateTo("/login");
    });
}

// Ensure navigateTo is available globally for the inline onclick
window.navigateTo = navigateTo;

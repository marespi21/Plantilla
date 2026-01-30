import { get, post } from "../services/api.js";
import { getLoggedUser } from "../services/auth.js";

let cart = [];

export async function setupOrders() {
  await loadMenu();
  setupCartActions();
}

async function loadMenu() {
  const menuContainer = document.getElementById("menu-container");
  if (!menuContainer) return;

  const products = await get("http://localhost:3000/menu");
  menuContainer.innerHTML = "";

  products.forEach(product => {
    menuContainer.innerHTML += `
      <div class="menu-card">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <strong>$${product.price}</strong>
        <button data-add-id="${product.id}">Agregar</button>
      </div>
    `;
  });
}

function setupCartActions() {
  document.addEventListener("click", async (e) => {
    const addBtn = e.target.closest("[data-add-id]");
    const orderBtn = e.target.closest("#confirm-order");

    if (addBtn) {
      await addToCart(addBtn.dataset.addId);
    }

    if (orderBtn) {
      await confirmOrder();
    }
  });
}

async function addToCart(productId) {
  const product = await get(`http://localhost:3000/menu/${productId}`);

  const existing = cart.find(item => item.id == product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById("cart");
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }

  cartContainer.innerHTML = `
    <ul>
      ${cart.map(item => `
        <li>
          ${item.name} x ${item.quantity} — $${item.price * item.quantity}
        </li>
      `).join("")}
    </ul>
    <strong>Total: $${calculateTotal()}</strong>
  `;
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

async function confirmOrder() {
  const user = getLoggedUser();

  if (!user) {
    Swal.fire("Error", "Debes iniciar sesión", "error");
    return;
  }

  if (cart.length === 0) {
    Swal.fire("Ups", "El carrito está vacío", "warning");
    return;
  }

  const order = {
    userId: user.id,
    items: cart,
    total: calculateTotal(),
    status: "pendiente",
    createdAt: new Date().toISOString()
  };

  await post("http://localhost:3000/orders", order);

  Swal.fire("Pedido enviado", "Gracias por tu compra", "success");

  cart = [];
  renderCart();
}

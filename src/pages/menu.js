import { get, post } from "../services/api.js";
import { getLoggedUser } from "../services/auth.js";

let cart = [];

export async function setupPublic() {
  const user = getLoggedUser();
  if (!user) return;

  renderUserInfo(user);
  await loadMenu();
  setupOrderActions();
}

/* =========================
   USER INFO
========================= */
function renderUserInfo(user) {
  const el = document.getElementById("user-name");
  if (el) el.textContent = user.name;
}

/* =========================
   MENU
========================= */
async function loadMenu() {
  const menuContainer = document.getElementById("menu-list");
  if (!menuContainer) return;

  const products = await get("http://localhost:3000/menu");
  menuContainer.innerHTML = "";

  products.forEach((product) => {
    menuContainer.innerHTML += `
      <div class="menu-item">
        <h4>${product.name}</h4>
        <p>${product.category}</p>
        <strong>$${product.price}</strong>
        <button data-add-id="${product.id}">Agregar</button>
      </div>
    `;
  });

  menuContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-id]");
    if (!btn) return;

    const productId = btn.dataset.addId;
    const product = products.find(p => p.id == productId);
    addToCart(product);
  });
}

/* =========================
   CART
========================= */
function addToCart(product) {
  const exists = cart.find(item => item.id === product.id);

  if (exists) {
    exists.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById("order-summary");
  const totalEl = document.getElementById("order-total");

  if (!cartContainer || !totalEl) return;

  cartContainer.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    cartContainer.innerHTML += `
      <li>
        ${item.name} x ${item.quantity}
        <strong>$${subtotal}</strong>
      </li>
    `;
  });

  totalEl.textContent = `$${total}`;
}

/* =========================
   ORDER
========================= */
function setupOrderActions() {
  const btn = document.getElementById("confirm-order");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (cart.length === 0) {
      Swal.fire("Ey", "No has agregado productos", "warning");
      return;
    }

    const user = getLoggedUser();

    const order = {
      userId: user.id,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: cart.reduce((acc, i) => acc + i.price * i.quantity, 0),
      status: "pendiente",
      createdAt: new Date().toISOString()
    };

    await post("http://localhost:3000/orders", order);

    Swal.fire("Pedido enviado", "Tu orden está en preparación 🍳", "success");

    cart = [];
    renderCart();
  });
}

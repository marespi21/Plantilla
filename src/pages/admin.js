import { get, update } from "../services/api.js";

const ORDER_STATUS = ["pendiente", "preparando", "listo", "entregado"];

export async function setupDashboard() {
  await loadOrders();
}

async function loadOrders() {
  const tableBody = document.getElementById("orders-table");
  if (!tableBody) return;

  const orders = await get("http://localhost:3000/orders");
  tableBody.innerHTML = "";

  orders.forEach(order => {
    tableBody.innerHTML += `
      <tr>
        <td>#${order.id}</td>
        <td>${order.userId}</td>
        <td>${renderItems(order.items)}</td>
        <td>$${order.total}</td>
        <td>
          <select data-status-id="${order.id}">
            ${ORDER_STATUS.map(status => `
              <option value="${status}" ${status === order.status ? "selected" : ""}>
                ${status}
              </option>
            `).join("")}
          </select>
        </td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
      </tr>
    `;
  });

  setupStatusChange();
}

function renderItems(items) {
  return `
    <ul>
      ${items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join("")}
    </ul>
  `;
}

function setupStatusChange() {
  document.querySelectorAll("[data-status-id]").forEach(select => {
    select.addEventListener("change", async (e) => {
      const orderId = e.target.dataset.statusId;
      const newStatus = e.target.value;

      await update("http://localhost:3000/orders", orderId, {
        status: newStatus
      });

      Swal.fire("Actualizado", `Estado: ${newStatus}`, "success");
    });
  });
}

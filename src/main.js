import { StorageService } from "./services/storage.js";
import { AuthService } from "./services/auth.js";
import { renderLogin } from "./pages/login.js";
import { renderUserDashboard } from "./pages/userDashboard.js";
import { renderAdminDashboard } from "./pages/adminDashboard.js";
import { renderProfile } from "./pages/profile.js";
import "./style.css"; // Ensure styles are loaded

const app = document.querySelector("#app");
const loginContent = document.querySelector("#login-content");

function init() {
  StorageService.init();
  router(); // Initial route check

  // Handle navigation links
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.getAttribute("href"));
    }
  });

  // Handle browser back/forward
  window.addEventListener("popstate", router);
}

export function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

function router() {
  const user = AuthService.getCurrentUser();
  const path = window.location.pathname;

  // Clear previous content
  app.innerHTML = "";
  loginContent.innerHTML = "";
  app.style.display = "block";

  // Login Route
  if (!user) {
    if (path !== "/login" && path !== "/") {
      // Redirect to login if not authenticated
      navigateTo("/login");
      return;
    }
    app.style.display = "none";
    loginContent.innerHTML = renderLogin();
    attachLoginEvents(); // Attach event listeners for login form
    return;
  }

  // Authenticated Routes
  if (path === "/login" || path === "/") {
    // Redirect based on role if already logged in
    if (user.role === "admin") navigateTo("/admin");
    else navigateTo("/dashboard");
    return;
  }

  if (path === "/profile") {
    renderProfile(app);
    return;
  }

  if (path === "/admin") {

    if (user.role !== "admin") {
      alert("Access Denied");
      navigateTo("/dashboard");
      return;
    }
    renderAdminDashboard(app);
    return;
  }

  if (path === "/dashboard") {
    if (user.role === "admin") {
      navigateTo("/admin"); // Redirect admin to their dashboard
      return;
    }
    renderUserDashboard(app);
    return;
  }

  // 404 - Default to dashboard logic
  navigateTo("/dashboard");
}

// Logic for Login View Events
function attachLoginEvents() {
  const form = document.querySelector("#login-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;
      const user = AuthService.login(email, password);

      if (user) {
        navigateTo(user.role === "admin" ? "/admin" : "/dashboard");
      } else {
        alert("Invalid credentials!");
      }
    });
  }
}

// Start application
document.addEventListener("DOMContentLoaded", init);
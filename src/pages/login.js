import { get } from "../services/api.js";
import { setLoggedUser } from "../services/auth.js";
import { navigate } from "../../main.js";

export function setupLogin() {
  const form = document.getElementById("login-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      Swal.fire("Ey", "Completa todos los campos", "warning");
      return;
    }

    try {
      // 🔎 Buscamos el usuario
      const users = await get(
        `http://localhost:3000/users?email=${email}&password=${password}`
      );

      if (!users || users.length === 0) {
        Swal.fire("Error", "Credenciales incorrectas", "error");
        return;
      }

      const user = users[0];

      // 💾 Guardamos sesión
      setLoggedUser(user);

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: `Hola ${user.name}`,
        timer: 1200,
        showConfirmButton: false
      });

      // 🚦 Redirección por rol
      navigate(user.role === "admin" ? "/admin" : "/public");

    } catch (error) {
      console.error(error);
      Swal.fire("Ups", "Error al iniciar sesión", "error");
    }
  });
}

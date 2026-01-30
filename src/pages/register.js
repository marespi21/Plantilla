import { get, post } from "../services/api.js";
import { navigate } from "../../main.js";

export function setupRegister() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password) {
      Swal.fire("Ey", "Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      // 🔎 Verificar si el email ya existe
      const existingUsers = await get(
        `http://localhost:3000/users?email=${email}`
      );

      if (existingUsers.length > 0) {
        Swal.fire("Ups", "Ese correo ya está registrado", "error");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        role
      };

      // 💾 Crear usuario
      await post("http://localhost:3000/users", newUser);

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Ahora puedes iniciar sesión",
        timer: 1500,
        showConfirmButton: false
      });

      navigate("/");

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo crear el usuario", "error");
    }
  });
}

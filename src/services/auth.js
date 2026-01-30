import { StorageService } from "./storage.js";

export const AuthService = {
  login(email, password) {
    const user = StorageService.getUserByEmail(email);
    if (user && user.password === password) {
      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      StorageService.setSession(sessionUser);
      return sessionUser;
    }
    return null;
  },

  logout() {
    StorageService.clearSession();
  },

  getCurrentUser() {
    return StorageService.getSession();
  },
};
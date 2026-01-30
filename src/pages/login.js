export function renderLogin() {
  return `
    <div class="login-container">
        <h1>Welcome to Riwi Eats</h1>
        <form id="login-form">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="admin@riwi.com" />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required placeholder="******" />
            </div>
            <button type="submit" class="btn-primary">Login</button>
        </form>
        <p class="hint">Hint: admin@riwi.com / admin | user@riwi.com / user</p>
    </div>
  `;
}

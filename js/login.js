document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  if (loginForm) {
    // Remove direct submission behavior
    loginForm.removeAttribute("action");
    loginForm.removeAttribute("method");

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Clear any existing alert boxes
      const oldAlert = loginForm.querySelector(".alert-box");
      if (oldAlert) {
        oldAlert.remove();
      }

      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      // Validate non-blank
      if (!email || !password) {
        showError("Please fill in all required fields.");
        return;
      }

      // Check credentials
      const users = getUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      const hashedInput = hashPassword(password);

      if (user && user.passwordHash === hashedInput) {
        localStorage.setItem("loggedInUser", user.email);
        window.location.href = "products.html";
      } else {
        showError("Incorrect email or password. Please try again.");
      }
    });
  }

  function showError(message) {
    const alertBox = document.createElement("div");
    alertBox.className = "alert-box";
    alertBox.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px; flex-shrink: 0;">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <span>${message}</span>
    `;
    const sibling = loginForm.querySelector("p");
    if (sibling) {
      sibling.parentNode.insertBefore(alertBox, sibling.nextSibling);
    } else {
      loginForm.insertBefore(alertBox, loginForm.firstChild);
    }
  }
});

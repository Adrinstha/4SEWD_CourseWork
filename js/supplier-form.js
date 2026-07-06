document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const supplierId = parseInt(urlParams.get("id"));
  let isEditMode = false;

  const form = document.querySelector("form");

  // Edit mode loading
  if (supplierId) {
    isEditMode = true;
    const suppliers = getSuppliers();
    const supplier = suppliers.find((s) => s.id === supplierId);

    if (supplier) {
      document.querySelector("h2").textContent = "Edit Supplier";
      const descEl = document.querySelector(".desc");
      if (descEl) {
        descEl.textContent = "Update the supplier details below.";
      }

      document.getElementById("name").value = supplier.name;
      document.getElementById("email").value = supplier.email;
      document.getElementById("phone").value = supplier.phone;
      document.getElementById("notes").value = supplier.notes || "";
    }
  }

  if (form) {
    form.removeAttribute("action");
    form.removeAttribute("method");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Clear old alerts
      const oldAlert = form.querySelector(".alert-box");
      if (oldAlert) {
        oldAlert.remove();
      }

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const notes = document.getElementById("notes").value.trim();

      // Validation
      if (!name || !email || !phone) {
        showError("Please fill in all required fields.");
        return;
      }

      if (!email.includes("@") || !email.includes(".")) {
        showError("Please enter a valid email address.");
        return;
      }

      let suppliers = getSuppliers();
      if (isEditMode) {
        const idx = suppliers.findIndex((s) => s.id === supplierId);
        if (idx !== -1) {
          suppliers[idx] = {
            id: supplierId,
            name: name,
            email: email,
            phone: phone,
            notes: notes,
          };
        }
      } else {
        const nextId =
          suppliers.length > 0
            ? Math.max(...suppliers.map((s) => s.id)) + 1
            : 1;
        const newSupplier = {
          id: nextId,
          name: name,
          email: email,
          phone: phone,
          notes: notes,
        };
        suppliers.push(newSupplier);
      }

      saveSuppliers(suppliers);
      window.location.href = "suppliers.html";
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
    if (form) {
      form.insertBefore(alertBox, form.firstChild);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

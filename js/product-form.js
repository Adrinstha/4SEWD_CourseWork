document.addEventListener("DOMContentLoaded", () => {
  // Populate suppliers in dropdown first
  populateSuppliers();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  let isEditMode = false;
  let currentImageBase64 = "";

  const fileInput = document.getElementById("image");
  const previewThumb = document.querySelector(".preview .thumb");
  const previewFilename = document.querySelector(".preview .filename");

  // If in edit mode, load data
  if (productId) {
    isEditMode = true;
    const products = getProducts();
    const product = products.find((p) => p.id === productId);

    if (product) {
      document.querySelector("h2").textContent = "Edit Product";
      const descEl = document.querySelector(".desc");
      if (descEl) {
        descEl.textContent =
          "Update the details below to edit the product record.";
      }

      document.getElementById("name").value = product.name;
      document.getElementById("description").value = product.description || "";
      document.getElementById("price").value = product.price;
      document.getElementById("quantity").value = product.quantity;
      document.getElementById("supplier").value = product.supplier;

      currentImageBase64 = product.image || "";
      if (currentImageBase64) {
        previewThumb.innerHTML = `<img src="${currentImageBase64}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-sm);" />`;
        previewThumb.classList.remove("empty");
        previewFilename.textContent = "Current product image";
      }

      // Image is not required when editing (user can keep existing)
      if (fileInput) {
        fileInput.required = false;
      }
    }
  }

  // Hook file upload logic
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        previewFilename.textContent = file.name;

        const reader = new FileReader();
        reader.onload = (event) => {
          currentImageBase64 = event.target.result;
          previewThumb.innerHTML = `<img src="${currentImageBase64}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-sm);" />`;
          previewThumb.classList.remove("empty");
        };
        reader.readAsDataURL(file);
      } else {
        if (!isEditMode) {
          currentImageBase64 = "";
          previewThumb.innerHTML = "No file";
          previewThumb.classList.add("empty");
          previewFilename.textContent = "Preview will show here";
        }
      }
    });
  }

  // Form submission logic
  const form = document.querySelector("form");
  if (form) {
    form.removeAttribute("action");
    form.removeAttribute("method");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Remove existing alert boxes
      const oldAlert = form.querySelector(".alert-box");
      if (oldAlert) {
        oldAlert.remove();
      }

      const name = document.getElementById("name").value.trim();
      const description = document.getElementById("description").value.trim();
      const priceVal = parseFloat(document.getElementById("price").value);
      const quantityVal = parseInt(document.getElementById("quantity").value);
      const supplier = document.getElementById("supplier").value;

      // Validation
      if (
        !name ||
        !description ||
        isNaN(priceVal) ||
        isNaN(quantityVal) ||
        !supplier
      ) {
        showError("Please fill out all required fields.");
        return;
      }

      if (priceVal < 0) {
        showError("Price cannot be a negative number.");
        return;
      }

      if (quantityVal < 0) {
        showError("Quantity cannot be a negative number.");
        return;
      }

      if (!isEditMode && !currentImageBase64) {
        showError("Please upload a product image.");
        return;
      }

      let products = getProducts();
      if (isEditMode) {
        const idx = products.findIndex((p) => p.id === productId);
        if (idx !== -1) {
          products[idx] = {
            id: productId,
            name: name,
            description: description,
            price: priceVal,
            quantity: quantityVal,
            supplier: supplier,
            image: currentImageBase64,
          };
        }
      } else {
        const nextId =
          products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
        const newProduct = {
          id: nextId,
          name: name,
          description: description,
          price: priceVal,
          quantity: quantityVal,
          supplier: supplier,
          image: currentImageBase64,
        };
        products.push(newProduct);
      }

      saveProducts(products);
      window.location.href = "products.html";
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

function populateSuppliers() {
  const select = document.getElementById("supplier");
  if (select) {
    const firstOption = select.firstElementChild;
    select.innerHTML = "";
    select.appendChild(firstOption);

    const suppliers = getSuppliers();
    suppliers.forEach((s) => {
      const option = document.createElement("option");
      option.value = s.name;
      option.textContent = s.name;
      select.appendChild(option);
    });
  }
}

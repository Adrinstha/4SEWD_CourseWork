document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  if (!productId) {
    window.location.href = "products.html";
    return;
  }

  const products = getProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    window.location.href = "products.html";
    return;
  }

  // Update Edit button target
  const editBtn = document.querySelector(".toolbar a.primary");
  if (editBtn) {
    editBtn.href = `product-form.html?id=${product.id}`;
  }

  // Update Back button target (just to make sure it's correct)
  const backBtn = document.querySelector(".toolbar a.secondary");
  if (backBtn) {
    backBtn.href = "products.html";
  }

  // Render product image
  const picDiv = document.querySelector(".details .pic");
  if (picDiv) {
    picDiv.innerHTML = `<img src="${product.image || "assets/laptop.svg"}" alt="${product.name}" />`;
  }

  // Render product details
  const infoDiv = document.querySelector(".details .info");
  if (infoDiv) {
    const isLow = parseInt(product.quantity) < 5;
    const badgeClass = isLow ? "alert" : "success";
    const badgeText = isLow ? "Low Stock" : "In Stock";

    infoDiv.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description || "No description provided."}</p>

      <ul>
        <li>
          <strong>SKU:</strong>
          <span>SF-${1000 + product.id}</span>
        </li>
        <li>
          <strong>Price:</strong>
          <span class="green">$${parseFloat(product.price).toFixed(2)}</span>
        </li>
        <li>
          <strong>Available:</strong>
          <span>${product.quantity} units <span class="badge ${badgeClass} indent">${badgeText}</span></span>
        </li>
        <li>
          <strong>Supplier:</strong>
          <span>${product.supplier}</span>
        </li>
        <li>
          <strong>Status:</strong>
          <span>Active</span>
        </li>
      </ul>
    `;
  }
});

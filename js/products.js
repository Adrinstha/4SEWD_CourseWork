document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.querySelector(".filters form");
  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      renderFilteredProducts();
    });
  }

  // Populate the supplier dropdown from localStorage
  populateSupplierDropdown();

  // Initial render of products
  renderFilteredProducts();
});

function populateSupplierDropdown() {
  const supplierSelect = document.querySelector('select[name="supplier"]');
  if (supplierSelect) {
    // Keep only the first "All Suppliers" option
    const firstOption = supplierSelect.firstElementChild;
    supplierSelect.innerHTML = "";
    supplierSelect.appendChild(firstOption);

    const suppliers = getSuppliers();
    suppliers.forEach((s) => {
      const option = document.createElement("option");
      option.value = s.name;
      option.textContent = s.name;
      supplierSelect.appendChild(option);
    });
  }
}

function renderFilteredProducts() {
  const products = getProducts();
  const searchInput = document.querySelector('input[name="search"]');
  const supplierSelect = document.querySelector('select[name="supplier"]');

  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const supplierVal = supplierSelect ? supplierSelect.value : "";

  const filtered = products.filter((p) => {
    const matchesSearch = !searchVal || p.name.toLowerCase().includes(searchVal);
    const matchesSupplier = !supplierVal || p.supplier === supplierVal;
    return matchesSearch && matchesSupplier;
  });

  const tbody = document.querySelector("table tbody");
  if (tbody) {
    tbody.innerHTML = "";

    if (filtered.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No products found.</td>`;
      tbody.appendChild(tr);
      return;
    }

    filtered.forEach((p) => {
      const tr = document.createElement("tr");

      // Low Stock Alert: drops below 5 items
      const isLow = parseInt(p.quantity) < 5;
      if (isLow) {
        tr.className = "low";
      }

      const badgeHtml = isLow
        ? `<span class="badge alert">Low Stock</span>`
        : `<span class="badge success">In Stock</span>`;

      tr.innerHTML = `
        <td>
          <div class="cell">
            <img src="${p.image || 'assets/laptop.svg'}" alt="${p.name}" class="image" />
            <strong>${p.name}</strong>
          </div>
        </td>
        <td>${p.supplier}</td>
        <td>$${parseFloat(p.price).toFixed(2)}</td>
        <td>${p.quantity} ${badgeHtml}</td>
        <td>
          <div class="actions">
            <a href="product-view.html?id=${p.id}">View</a>
            <a href="product-form.html?id=${p.id}">Edit</a>
            <a href="#" class="red" onclick="deleteProduct(${p.id}, event)">Delete</a>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function deleteProduct(id, event) {
  event.preventDefault();
  event.stopPropagation();
  if (confirm("Are you sure you want to delete this product?")) {
    let products = getProducts();
    products = products.filter((p) => p.id !== id);
    saveProducts(products);
    renderFilteredProducts();
  }
}

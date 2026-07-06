document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".filters form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      renderFilteredSuppliers();
    });
  }
  renderFilteredSuppliers();
});

function renderFilteredSuppliers() {
  const suppliers = getSuppliers();
  const searchInput = document.querySelector('input[name="search"]');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filtered = suppliers.filter((s) => {
    return (
      !searchVal ||
      s.name.toLowerCase().includes(searchVal) ||
      s.email.toLowerCase().includes(searchVal) ||
      s.phone.toLowerCase().includes(searchVal)
    );
  });

  const tbody = document.querySelector("table tbody");
  if (tbody) {
    tbody.innerHTML = "";

    if (filtered.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No suppliers found.</td>`;
      tbody.appendChild(tr);

      updatePaginationText(0, 0);
      return;
    }

    filtered.forEach((s) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${s.name}</strong></td>
        <td>${s.email}</td>
        <td>${s.phone}</td>
        <td>
          <div class="actions">
            <a href="supplier-form.html?id=${s.id}">Edit</a>
            <a href="#" class="red" onclick="deleteSupplier(${s.id}, event)">Delete</a>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    updatePaginationText(filtered.length, suppliers.length);
  }
}

function updatePaginationText(count, total) {
  const pagesText = document.querySelector(".pages p");
  if (pagesText) {
    pagesText.textContent = `Showing 1-${count} of ${total} suppliers`;
  }
}

function deleteSupplier(id, event) {
  event.preventDefault();
  event.stopPropagation();
  if (confirm("Are you sure you want to delete this supplier?")) {
    let suppliers = getSuppliers();
    suppliers = suppliers.filter((s) => s.id !== id);
    saveSuppliers(suppliers);
    renderFilteredSuppliers();
  }
}

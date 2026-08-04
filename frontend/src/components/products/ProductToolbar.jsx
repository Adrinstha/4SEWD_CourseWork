function ProductToolbar({
  suppliers,
  searchTerm,
  selectedSupplier,
  onSearchChange,
  onSupplierChange,
}) {
  return (
    <div className="product-toolbar">
      <div className="form-group product-toolbar__search">
        <label htmlFor="product-search">Search products</label>

        <input
          id="product-search"
          name="productSearch"
          type="search"
          value={searchTerm}
          placeholder="Search by name, description or supplier"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="form-group product-toolbar__filter">
        <label htmlFor="supplier-filter">Supplier</label>

        <select
          id="supplier-filter"
          name="supplierFilter"
          value={selectedSupplier}
          onChange={(event) => onSupplierChange(event.target.value)}
        >
          <option value="all">All suppliers</option>

          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProductToolbar;

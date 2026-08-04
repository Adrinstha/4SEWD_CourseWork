import ProductRow from "./ProductRow.jsx";

function ProductTable({
  products,
  suppliers,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
}) {
  function getSupplierName(supplierId) {
    const supplier = suppliers.find((item) => item.id === supplierId);
    return supplier?.name ?? "Unknown supplier";
  }

  function renderSortIndicator(field) {
    if (sortField !== field) {
      return <span style={{ opacity: 0.35, marginLeft: "4px" }}>↕</span>;
    }
    return (
      <span style={{ marginLeft: "4px", color: "var(--primary)", fontWeight: "bold" }}>
        {sortDirection === "asc" ? "▲" : "▼"}
      </span>
    );
  }

  const headerStyle = {
    cursor: "pointer",
    userSelect: "none",
  };

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <caption className="sr-only">StockFlow product inventory</caption>

        <thead>
          <tr>
            <th scope="col" style={headerStyle} onClick={() => onSort && onSort("name")}>
              Product {renderSortIndicator("name")}
            </th>
            <th scope="col" style={headerStyle} onClick={() => onSort && onSort("supplier")}>
              Supplier {renderSortIndicator("supplier")}
            </th>
            <th scope="col" style={headerStyle} onClick={() => onSort && onSort("price")}>
              Price {renderSortIndicator("price")}
            </th>
            <th scope="col" style={headerStyle} onClick={() => onSort && onSort("quantity")}>
              Quantity {renderSortIndicator("quantity")}
            </th>
            <th scope="col" style={headerStyle} onClick={() => onSort && onSort("status")}>
              Status {renderSortIndicator("status")}
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              supplierName={getSupplierName(product.supplierId)}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;

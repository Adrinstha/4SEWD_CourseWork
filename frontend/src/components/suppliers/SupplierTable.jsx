import SupplierRow from "./SupplierRow.jsx";

function SupplierTable({ suppliers, sortField, sortDirection, onSort, onEdit, onDelete }) {
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
        <caption className="sr-only">StockFlow suppliers list</caption>

        <thead>
          <tr>
            <th scope="col" style={headerStyle} onClick={() => onSort && onSort("name")}>
              Supplier Name {renderSortIndicator("name")}
            </th>
            <th scope="col" style={headerStyle} onClick={() => onSort && onSort("email")}>
              Email {renderSortIndicator("email")}
            </th>
            <th scope="col">Phone</th>
            <th scope="col">Notes</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier) => (
            <SupplierRow
              key={supplier.id}
              supplier={supplier}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierTable;

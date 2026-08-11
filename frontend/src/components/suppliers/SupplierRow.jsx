function SupplierRow({ supplier, isAdmin, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <strong>{supplier.name}</strong>
      </td>

      <td>{supplier.email}</td>

      <td>{supplier.phone || "—"}</td>

      <td>
        <span
          style={{
            color: supplier.notes ? "var(--text-main)" : "var(--text-muted)",
            fontSize: "0.875rem",
          }}
        >
          {supplier.notes || "No notes"}
        </span>
      </td>

      <td>
        <div className="table-actions">
          {isAdmin ? (
            <>
              <button
                className="button button--secondary button--small"
                type="button"
                onClick={() => onEdit && onEdit(supplier)}
              >
                Edit
              </button>

              <button
                className="button button--danger button--small"
                type="button"
                onClick={() => onDelete && onDelete(supplier.id)}
              >
                Delete
              </button>
            </>
          ) : (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              View Only
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

export default SupplierRow;

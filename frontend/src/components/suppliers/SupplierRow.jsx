function SupplierRow({ supplier, onEdit, onDelete }) {
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
          <button
            className="button button--secondary button--small"
            type="button"
            onClick={() => onEdit(supplier)}
          >
            Edit
          </button>

          <button
            className="button button--danger button--small"
            type="button"
            onClick={() => onDelete(supplier.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default SupplierRow;

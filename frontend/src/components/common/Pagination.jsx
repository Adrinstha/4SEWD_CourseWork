function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className="pagination-bar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "1rem",
        paddingTop: "1rem",
        borderTop: "1px solid var(--border)",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}
    >
      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
        <strong>{totalItems}</strong> entries
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              fontSize: "0.85rem",
              marginRight: "0.5rem",
            }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        )}

        <button
          className="button button--secondary button--small"
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            padding: "0 0.5rem",
          }}
        >
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="button button--secondary button--small"
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;

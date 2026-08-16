function getStockStatus(quantity) {
  if (quantity === 0) {
    return {
      label: "Out of stock",
      className: "stock-status stock-status--empty",
    };
  }

  if (quantity < 5) {
    return {
      label: "Low stock",
      className: "stock-status stock-status--low",
    };
  }

  return {
    label: "In stock",
    className: "stock-status stock-status--available",
  };
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function ProductDetailModal({ product, supplierName, onClose }) {
  if (!product) return null;

  const stockStatus = getStockStatus(product.quantity);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "550px",
          width: "100%",
          position: "relative",
          backgroundColor: "var(--card-bg)",
          color: "var(--text-main)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "96px",
              height: "96px",
              objectFit: "contain",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--background)",
              padding: "0.5rem",
              border: "1px solid var(--border)",
            }}
          />
          <div>
            <span
              className={stockStatus.className}
              style={{ marginBottom: "0.5rem", display: "inline-block" }}
            >
              {stockStatus.label}
            </span>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
              {product.name}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Supplier: <strong>{supplierName || "Unknown"}</strong>
            </p>
          </div>
        </div>

        <div className="group">
          <label>Description</label>
          <p
            style={{
              color: "var(--text-main)",
              backgroundColor: "var(--background)",
              padding: "0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              fontSize: "0.9rem",
            }}
          >
            {product.description || "No description provided."}
          </p>
        </div>

        <div className="row" style={{ marginBottom: "1.5rem" }}>
          <div className="group" style={{ marginBottom: 0 }}>
            <label>Price</label>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "var(--primary)",
              }}
            >
              {formatPrice(product.price)}
            </p>
          </div>
          <div className="group" style={{ marginBottom: 0 }}>
            <label>Quantity in Stock</label>
            <p style={{ fontSize: "1.25rem", fontWeight: "700" }}>
              {product.quantity} units
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="button button--secondary"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;

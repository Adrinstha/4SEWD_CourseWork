function getStockStatus(quantity) {
  if (quantity === 0) {
    return {
      label: "Out of stock",
      className: "stock-status stock-status--empty",
    };
  }

  if (quantity <= 10) {
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

function ProductRow({ product, supplierName, isAdmin, onView, onEdit, onDelete }) {
  const stockStatus = getStockStatus(product.quantity);

  return (
    <tr>
      <td>
        <div className="product-summary">
          <img
            className="product-summary__image"
            src={product.image}
            alt={product.name}
          />

          <div>
            <strong>{product.name}</strong>

            <span className="product-summary__description">
              {product.description}
            </span>
          </div>
        </div>
      </td>

      <td>{supplierName}</td>
      <td>{formatPrice(product.price)}</td>
      <td>{product.quantity}</td>

      <td>
        <span className={stockStatus.className}>{stockStatus.label}</span>
      </td>

      <td>
        <div className="table-actions">
          <button
            className="button button--secondary button--small"
            type="button"
            onClick={() => onView && onView(product)}
          >
            View
          </button>

          {/* Admin only actions */}
          {isAdmin && (
            <>
              <button
                className="button button--secondary button--small"
                type="button"
                onClick={() => onEdit && onEdit(product)}
              >
                Edit
              </button>

              <button
                className="button button--danger button--small"
                type="button"
                onClick={() => onDelete && onDelete(product.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default ProductRow;

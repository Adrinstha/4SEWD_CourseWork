export function validateProduct(product, isEditMode = false, hasFile = false) {
  const errors = {};

  if (!product.name || !product.name.trim()) {
    errors.name = "Product name is required.";
  } else if (product.name.trim().length < 2) {
    errors.name = "Product name must contain at least 2 characters.";
  }

  if (!product.description || !product.description.trim()) {
    errors.description = "Description is required.";
  } else if (product.description.trim().length < 10) {
    errors.description = "Description must contain at least 10 characters.";
  }

  if (product.price === "" || product.price === undefined || product.price === null) {
    errors.price = "Price is required.";
  } else {
    const price = Number(product.price);

    if (!Number.isFinite(price)) {
      errors.price = "Enter a valid price.";
    } else if (price < 0) {
      errors.price = "Price cannot be negative.";
    }
  }

  if (product.quantity === "" || product.quantity === undefined || product.quantity === null) {
    errors.quantity = "Quantity is required.";
  } else {
    const quantity = Number(product.quantity);

    if (!Number.isInteger(quantity)) {
      errors.quantity = "Quantity must be a whole number.";
    } else if (quantity < 0) {
      errors.quantity = "Quantity cannot be negative.";
    }
  }

  if (!product.supplierId) {
    errors.supplierId = "Select a supplier.";
  }

  if (!isEditMode && !hasFile) {
    errors.image = "A product image file is required.";
  }

  return errors;
}

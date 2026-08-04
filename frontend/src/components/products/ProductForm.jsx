import { useState } from "react";
import * as productService from "../../services/productService.js";
import { validateProduct } from "../../utils/productValidation.js";

const INITIAL_FORM_VALUES = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  supplierId: "",
  image: "",
};

const PRODUCT_IMAGES = [
  {
    value: "/assets/laptop.svg",
    label: "Laptop",
  },
  {
    value: "/assets/mouse.svg",
    label: "Mouse",
  },
  {
    value: "/assets/keyboard.svg",
    label: "Keyboard",
  },
  {
    value: "/assets/headset.svg",
    label: "Headset",
  },
  {
    value: "/assets/phone.svg",
    label: "Phone",
  },
];

function ProductForm({
  suppliers,
  productToEdit = null,
  onProductAdded,
  onProductSaved,
  onCancel,
}) {
  const isEditMode = Boolean(productToEdit);

  const [formValues, setFormValues] = useState(() => {
    if (productToEdit) {
      return {
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        price: String(productToEdit.price ?? ""),
        quantity: String(productToEdit.quantity ?? ""),
        supplierId: productToEdit.supplierId || "",
        image: productToEdit.image || "",
      };
    }
    return INITIAL_FORM_VALUES;
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));

    setSuccessMessage("");
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateProduct(formValues);

    setErrors(validationErrors);
    setSuccessMessage("");
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const productPayload = {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        price: Number(formValues.price),
        quantity: Number(formValues.quantity),
        supplierId: formValues.supplierId,
        image: formValues.image,
      };

      if (isEditMode) {
        const updatedProduct = await productService.update(
          productToEdit.id,
          productPayload,
        );
        if (onProductSaved) {
          onProductSaved(updatedProduct);
        } else if (onProductAdded) {
          onProductAdded(updatedProduct);
        }
        setSuccessMessage(`"${updatedProduct.name}" was updated successfully.`);
      } else {
        const newProduct = await productService.add(productPayload);
        if (onProductAdded) {
          onProductAdded(newProduct);
        } else if (onProductSaved) {
          onProductSaved(newProduct);
        }
        setFormValues(INITIAL_FORM_VALUES);
        setErrors({});
        setSuccessMessage(`"${newProduct.name}" was added successfully.`);
      }
    } catch (error) {
      console.error("Unable to save product:", error);
      setSubmitError("The product could not be saved. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    if (isEditMode) {
      setFormValues({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        price: String(productToEdit.price ?? ""),
        quantity: String(productToEdit.quantity ?? ""),
        supplierId: productToEdit.supplierId || "",
        image: productToEdit.image || "",
      });
    } else {
      setFormValues(INITIAL_FORM_VALUES);
    }
    setErrors({});
    setSuccessMessage("");
    setSubmitError("");
  }

  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        image: "Please select a valid image file (PNG, JPG, SVG, WebP).",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        image: "Image file size must be less than 2MB.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result;
      setFormValues((previousValues) => ({
        ...previousValues,
        image: dataUrl,
      }));
      setErrors((previousErrors) => ({
        ...previousErrors,
        image: "",
      }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <form className="product-form" noValidate onSubmit={handleSubmit}>
      {successMessage && (
        <div className="alert alert--success" role="status" aria-live="polite">
          {successMessage}
        </div>
      )}

      {submitError && (
        <div className="alert alert--error" role="alert">
          {submitError}
        </div>
      )}

      <div className="form-grid">
        <div className="form-group form-grid__full">
          <label htmlFor="product-name">
            Product name
            <span aria-hidden="true"> *</span>
          </label>

          <input
            id="product-name"
            name="name"
            type="text"
            value={formValues.name}
            placeholder="For example, ProBook Laptop"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "product-name-error" : undefined}
            onChange={handleChange}
          />

          {errors.name && (
            <p className="field-error" id="product-name-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="form-group form-grid__full">
          <label htmlFor="product-description">
            Description
            <span aria-hidden="true"> *</span>
          </label>

          <textarea
            id="product-description"
            name="description"
            rows="4"
            value={formValues.description}
            placeholder="Describe the product and its main use"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "product-description-error" : undefined
            }
            onChange={handleChange}
          />

          {errors.description && (
            <p className="field-error" id="product-description-error">
              {errors.description}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="product-price">
            Price
            <span aria-hidden="true"> *</span>
          </label>

          <input
            id="product-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formValues.price}
            placeholder="0.00"
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? "product-price-error" : undefined}
            onChange={handleChange}
          />

          {errors.price && (
            <p className="field-error" id="product-price-error">
              {errors.price}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="product-quantity">
            Quantity
            <span aria-hidden="true"> *</span>
          </label>

          <input
            id="product-quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={formValues.quantity}
            placeholder="0"
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={
              errors.quantity ? "product-quantity-error" : undefined
            }
            onChange={handleChange}
          />

          {errors.quantity && (
            <p className="field-error" id="product-quantity-error">
              {errors.quantity}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="product-supplier">
            Supplier
            <span aria-hidden="true"> *</span>
          </label>

          <select
            id="product-supplier"
            name="supplierId"
            value={formValues.supplierId}
            aria-invalid={Boolean(errors.supplierId)}
            aria-describedby={
              errors.supplierId ? "product-supplier-error" : undefined
            }
            onChange={handleChange}
          >
            <option value="">Select a supplier</option>

            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>

          {errors.supplierId && (
            <p className="field-error" id="product-supplier-error">
              {errors.supplierId}
            </p>
          )}
        </div>

        <div className="form-group form-grid__full">
          <label>
            Product Image <span aria-hidden="true">*</span>
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div>
              <label htmlFor="product-image-select" style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                Choose preset icon:
              </label>
              <select
                id="product-image-select"
                name="image"
                value={PRODUCT_IMAGES.some((img) => img.value === formValues.image) ? formValues.image : ""}
                onChange={handleChange}
              >
                <option value="">Select preset image</option>
                {PRODUCT_IMAGES.map((image) => (
                  <option key={image.value} value={image.value}>
                    {image.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="product-image-file" style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                Or upload custom file:
              </label>
              <input
                id="product-image-file"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ padding: "6px 10px", minHeight: "44px" }}
              />
            </div>
          </div>

          {errors.image && (
            <p className="field-error" id="product-image-error">
              {errors.image}
            </p>
          )}
        </div>
      </div>

      {formValues.image && (
        <div className="image-preview" style={{ marginTop: "1rem" }}>
          <p>Image preview</p>

          <img
            src={formValues.image}
            alt="Selected product preview"
            style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: "8px", border: "1px solid var(--border)" }}
          />
        </div>
      )}

      <p className="required-note">Fields marked with * are required.</p>

      <div className="form-actions">
        <button
          className="button button--primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving product..." : "Save product"}
        </button>

        <button
          className="button button--secondary"
          type="button"
          disabled={isSubmitting}
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          className="button button--secondary"
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProductForm;

import { useState } from "react";
import * as supplierService from "../../services/supplierService.js";
import { validateSupplier } from "../../utils/supplierValidation.js";

const INITIAL_FORM_VALUES = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

function SupplierForm({
  supplierToEdit = null,
  onSupplierSaved,
  onCancel,
}) {
  const isEditMode = Boolean(supplierToEdit);

  const [formValues, setFormValues] = useState(() => {
    if (supplierToEdit) {
      return {
        name: supplierToEdit.name || "",
        email: supplierToEdit.email || "",
        phone: supplierToEdit.phone || "",
        notes: supplierToEdit.notes || "",
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

    const validationErrors = validateSupplier(formValues);
    setErrors(validationErrors);
    setSuccessMessage("");
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
        notes: formValues.notes.trim(),
      };

      let savedSupplier;
      if (isEditMode) {
        savedSupplier = await supplierService.update(
          supplierToEdit.id,
          payload,
        );
        setSuccessMessage(`"${savedSupplier.name}" updated successfully.`);
      } else {
        savedSupplier = await supplierService.add(payload);
        setFormValues(INITIAL_FORM_VALUES);
        setSuccessMessage(`"${savedSupplier.name}" added successfully.`);
      }

      if (onSupplierSaved) {
        onSupplierSaved(savedSupplier);
      }
    } catch (error) {
      console.error("Unable to save supplier:", error);
      setSubmitError("Failed to save supplier. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    if (isEditMode) {
      setFormValues({
        name: supplierToEdit.name || "",
        email: supplierToEdit.email || "",
        phone: supplierToEdit.phone || "",
        notes: supplierToEdit.notes || "",
      });
    } else {
      setFormValues(INITIAL_FORM_VALUES);
    }
    setErrors({});
    setSuccessMessage("");
    setSubmitError("");
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
          <label htmlFor="supplier-name">
            Supplier Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="supplier-name"
            name="name"
            type="text"
            value={formValues.name}
            placeholder="For example, TechSource Nepal"
            onChange={handleChange}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="supplier-email">
            Email Address <span aria-hidden="true">*</span>
          </label>
          <input
            id="supplier-email"
            name="email"
            type="email"
            value={formValues.email}
            placeholder="sales@example.com"
            onChange={handleChange}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="supplier-phone">Phone Number</label>
          <input
            id="supplier-phone"
            name="phone"
            type="text"
            value={formValues.phone}
            placeholder="+977 1 555 0101"
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-grid__full">
          <label htmlFor="supplier-notes">Notes</label>
          <textarea
            id="supplier-notes"
            name="notes"
            rows="3"
            value={formValues.notes}
            placeholder="Additional notes about supplier products or terms..."
            onChange={handleChange}
          />
        </div>
      </div>

      <p className="required-note">Fields marked with * are required.</p>

      <div className="form-actions">
        <button
          className="button button--primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Supplier"
              : "Save Supplier"}
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

export default SupplierForm;

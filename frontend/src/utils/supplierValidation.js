export function validateSupplier(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Supplier name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Supplier name must contain at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
}

export default validateSupplier;

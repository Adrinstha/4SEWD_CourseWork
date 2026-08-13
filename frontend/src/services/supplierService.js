import { apiClient } from "./apiClient.js";

function normalizeSupplier(s) {
  if (!s) return null;
  return {
    ...s,
    id: Number(s.id),
  };
}

export async function getAll() {
  const suppliers = await apiClient("/api/suppliers");
  return suppliers.map(normalizeSupplier);
}

export async function getById(id) {
  const supplier = await apiClient(`/api/suppliers/${id}`);
  return normalizeSupplier(supplier);
}

export async function create(supplierData) {
  const created = await apiClient("/api/suppliers", {
    method: "POST",
    body: {
      name: supplierData.name,
      email: supplierData.email,
      phone: supplierData.phone || "",
      notes: supplierData.notes || "",
    },
  });
  return normalizeSupplier(created);
}

export async function update(id, supplierData) {
  const updated = await apiClient(`/api/suppliers/${id}`, {
    method: "PUT",
    body: {
      name: supplierData.name,
      email: supplierData.email,
      phone: supplierData.phone || "",
      notes: supplierData.notes || "",
    },
  });
  return normalizeSupplier(updated);
}

export const add = create;

export async function remove(id) {
  await apiClient(`/api/suppliers/${id}`, {
    method: "DELETE",
  });
  return true;
}

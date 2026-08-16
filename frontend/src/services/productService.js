import { apiClient } from "./apiClient.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function normalizeProduct(p) {
  if (!p) return null;
  let imageUrl = p.image || "/assets/icons/box.svg";
  if (imageUrl.startsWith("/uploads/")) {
    imageUrl = `${API_BASE_URL}${imageUrl}`;
  }
  return {
    ...p,
    price: Number(p.price),
    quantity: Number(p.quantity),
    supplierId: Number(p.supplierId),
    image: imageUrl,
  };
}

export async function getAll() {
  const products = await apiClient("/api/products");
  return products.map(normalizeProduct);
}

export async function getById(id) {
  const product = await apiClient(`/api/products/${id}`);
  return normalizeProduct(product);
}

export async function create(productData, imageFile = null) {
  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("quantity", productData.quantity);
  formData.append("supplierId", productData.supplierId);
  if (imageFile instanceof File) {
    formData.append("image", imageFile);
  }

  const created = await apiClient("/api/products", {
    method: "POST",
    body: formData,
  });

  return normalizeProduct(created);
}

export async function update(id, productData, imageFile = null) {
  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("quantity", productData.quantity);
  formData.append("supplierId", productData.supplierId);
  if (imageFile instanceof File) {
    formData.append("image", imageFile);
  }

  const updated = await apiClient(`/api/products/${id}`, {
    method: "PUT",
    body: formData,
  });

  return normalizeProduct(updated);
}

export async function remove(id) {
  await apiClient(`/api/products/${id}`, {
    method: "DELETE",
  });
  return true;
}

export async function hasProductsForSupplier(supplierId) {
  const products = await getAll();
  return products.some((p) => Number(p.supplierId) === Number(supplierId));
}

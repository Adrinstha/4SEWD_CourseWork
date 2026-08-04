import createId from "../utils/createId.js";
import database, { STORAGE_KEYS } from "./database.js";

export async function getAll() {
  const products = await database.getItem(STORAGE_KEYS.PRODUCTS);

  return Array.isArray(products) ? products : [];
}

export async function getById(productId) {
  const products = await getAll();

  return products.find((product) => product.id === productId) ?? null;
}
export async function hasProductsForSupplier(supplierId) {
  const products = await getAll();

  return products.some((product) => product.supplierId === supplierId);
}
export async function add(productData) {
  const products = await getAll();
  const timestamp = new Date().toISOString();

  const newProduct = {
    ...productData,
    id: createId("product"),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const updatedProducts = [...products, newProduct];

  await database.setItem(STORAGE_KEYS.PRODUCTS, updatedProducts);

  return newProduct;
}

export async function update(productId, productData) {
  const products = await getAll();

  const existingProduct = products.find((product) => product.id === productId);

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  const updatedProduct = {
    ...existingProduct,
    ...productData,
    id: existingProduct.id,
    createdAt: existingProduct.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const updatedProducts = products.map((product) =>
    product.id === productId ? updatedProduct : product,
  );

  await database.setItem(STORAGE_KEYS.PRODUCTS, updatedProducts);

  return updatedProduct;
}

export async function remove(productId) {
  const products = await getAll();

  const productExists = products.some((product) => product.id === productId);

  if (!productExists) {
    throw new Error("Product not found.");
  }

  const updatedProducts = products.filter(
    (product) => product.id !== productId,
  );

  await database.setItem(STORAGE_KEYS.PRODUCTS, updatedProducts);

  return updatedProducts;
}

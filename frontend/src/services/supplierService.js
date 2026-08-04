import createId from "../utils/createId.js";
import database, { STORAGE_KEYS } from "./database.js";

export async function getAll() {
  const suppliers = await database.getItem(STORAGE_KEYS.SUPPLIERS);

  return Array.isArray(suppliers) ? suppliers : [];
}

export async function getById(supplierId) {
  const suppliers = await getAll();

  return suppliers.find((supplier) => supplier.id === supplierId) ?? null;
}

export async function add(supplierData) {
  const suppliers = await getAll();
  const timestamp = new Date().toISOString();

  const newSupplier = {
    ...supplierData,
    id: createId("supplier"),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const updatedSuppliers = [...suppliers, newSupplier];

  await database.setItem(STORAGE_KEYS.SUPPLIERS, updatedSuppliers);

  return newSupplier;
}

export async function update(supplierId, supplierData) {
  const suppliers = await getAll();

  const existingSupplier = suppliers.find(
    (supplier) => supplier.id === supplierId,
  );

  if (!existingSupplier) {
    throw new Error("Supplier not found.");
  }

  const updatedSupplier = {
    ...existingSupplier,
    ...supplierData,
    id: existingSupplier.id,
    createdAt: existingSupplier.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const updatedSuppliers = suppliers.map((supplier) =>
    supplier.id === supplierId ? updatedSupplier : supplier,
  );

  await database.setItem(STORAGE_KEYS.SUPPLIERS, updatedSuppliers);

  return updatedSupplier;
}

export async function remove(supplierId) {
  const suppliers = await getAll();

  const supplierExists = suppliers.some(
    (supplier) => supplier.id === supplierId,
  );

  if (!supplierExists) {
    throw new Error("Supplier not found.");
  }

  const updatedSuppliers = suppliers.filter(
    (supplier) => supplier.id !== supplierId,
  );

  await database.setItem(STORAGE_KEYS.SUPPLIERS, updatedSuppliers);

  return updatedSuppliers;
}

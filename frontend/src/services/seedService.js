import { initialProducts, initialSuppliers } from "../data/seedData.js";
import database, { STORAGE_KEYS } from "./database.js";

function addTimestamps(items) {
  const timestamp = new Date().toISOString();

  return items.map((item) => ({
    ...item,
    createdAt: item.createdAt ?? timestamp,
    updatedAt: item.updatedAt ?? timestamp,
  }));
}

export async function initializeDatabase() {
  const [storedProducts, storedSuppliers] = await Promise.all([
    database.getItem(STORAGE_KEYS.PRODUCTS),
    database.getItem(STORAGE_KEYS.SUPPLIERS),
  ]);

  const initializationTasks = [];

  if (storedProducts === null) {
    initializationTasks.push(
      database.setItem(STORAGE_KEYS.PRODUCTS, addTimestamps(initialProducts)),
    );
  }

  if (storedSuppliers === null) {
    initializationTasks.push(
      database.setItem(STORAGE_KEYS.SUPPLIERS, addTimestamps(initialSuppliers)),
    );
  }

  await Promise.all(initializationTasks);
}

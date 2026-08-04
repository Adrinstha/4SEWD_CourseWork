import localforage from "localforage";

const database = localforage.createInstance({
  name: "StockFlowDatabase",
  storeName: "stockflow_data",
  description: "Persistent product and supplier data for StockFlow",
});

export const STORAGE_KEYS = Object.freeze({
  PRODUCTS: "products",
  SUPPLIERS: "suppliers",
});

export default database;

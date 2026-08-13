import sequelize from "../config/database.js";
import User from "./User.js";
import Supplier from "./Supplier.js";
import Product from "./Product.js";

// Define Associations
Supplier.hasMany(Product, {
  foreignKey: {
    name: "supplierId",
    allowNull: false,
  },
  as: "products",
  onDelete: "RESTRICT",
});

Product.belongsTo(Supplier, {
  foreignKey: {
    name: "supplierId",
    allowNull: false,
  },
  as: "supplier",
});

export { sequelize, User, Supplier, Product };

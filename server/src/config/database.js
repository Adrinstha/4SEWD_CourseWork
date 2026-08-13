import path from "path";
import fileURLToPath from "url";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const storagePath = process.env.DB_STORAGE || "./storage/inventory.sqlite";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(process.cwd(), storagePath),
  logging: false, // Set to console.log for debugging SQL queries
});

export default sequelize;

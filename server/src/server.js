import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/database.js";
import { User } from "./models/index.js";
import { seedDatabase } from "./seed/seedData.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync();
    console.log("Database models synchronized.");

    // Check if initial admin exists; if not, seed default data automatically
    const adminCount = await User.count({ where: { role: "admin" } });
    if (adminCount === 0) {
      console.log("No admin user detected. Running initial database seed...");
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`StockFlow Backend Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();

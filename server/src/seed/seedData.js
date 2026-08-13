import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { sequelize, User, Supplier, Product } from "../models/index.js";

export async function seedDatabase() {
  const storageDir = path.resolve(process.cwd(), "./storage");
  const uploadsDir = path.resolve(process.cwd(), "./storage/uploads");

  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  await sequelize.sync();
  console.log("Database synchronized.");

  // Seed Users
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const userPasswordHash = await bcrypt.hash("User123!", 10);

  const admin = await User.create({
    username: "admin",
    email: "admin@stockflow.com",
    name: "System Admin",
    passwordHash: adminPasswordHash,
    role: "admin",
  });

  await User.create({
    username: "user",
    email: "user@stockflow.com",
    name: "Regular User",
    passwordHash: userPasswordHash,
    role: "user",
  });

  await User.create({
    username: "adrin",
    email: "adrinshrestha16@gmail.com",
    name: "Adrin Shrestha",
    passwordHash: await bcrypt.hash("admin123", 10),
    role: "admin",
  });

  console.log("Users seeded.");

  // Seed Suppliers
  const sup1 = await Supplier.create({
    name: "TechSource Nepal",
    email: "sales@techsource.example",
    phone: "+977 1 555 0101",
    notes: "Primary supplier for computers and office technology.",
  });

  const sup2 = await Supplier.create({
    name: "Digital Traders",
    email: "orders@digitaltraders.example",
    phone: "+977 1 555 0102",
    notes: "Supplier for computer accessories and peripherals.",
  });

  const sup3 = await Supplier.create({
    name: "Smart Electronics",
    email: "contact@smartelectronics.example",
    phone: "+977 1 555 0103",
    notes: "Supplier for mobile phones and electronic equipment.",
  });

  console.log("Suppliers seeded.");

  // Seed Products
  await Product.create({
    name: "ProBook Laptop",
    description: "Reliable business laptop for everyday office work.",
    price: 899.0,
    quantity: 24,
    supplierId: sup1.id,
    image: "/assets/laptop.svg",
  });

  await Product.create({
    name: "Wireless Mouse",
    description: "Comfortable wireless mouse with an ergonomic design.",
    price: 29.99,
    quantity: 3, // Low stock (< 5)
    supplierId: sup2.id,
    image: "/assets/mouse.svg",
  });

  await Product.create({
    name: "Mechanical Keyboard",
    description: "Mechanical keyboard designed for accurate typing.",
    price: 79.99,
    quantity: 0, // Out of stock (0)
    supplierId: sup2.id,
    image: "/assets/keyboard.svg",
  });

  await Product.create({
    name: "Office Headset",
    description: "Noise-reducing headset for calls and online meetings.",
    price: 54.5,
    quantity: 17,
    supplierId: sup2.id,
    image: "/assets/headset.svg",
  });

  await Product.create({
    name: "Smartphone",
    description: "Modern smartphone for communication and business use.",
    price: 649.0,
    quantity: 4, // Low stock (< 5)
    supplierId: sup3.id,
    image: "/assets/phone.svg",
  });

  console.log("Products seeded successfully.");
}

// Execute directly if script is run via CLI
if (process.argv[1] && process.argv[1].endsWith("seedData.js")) {
  seedDatabase()
    .then(() => {
      console.log("Seeding complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

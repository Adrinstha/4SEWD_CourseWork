import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";
import { validateProduct } from "../validators/productValidator.js";

const router = express.Router();

router.get("/", authenticateToken, getAllProducts);
router.get("/:id", authenticateToken, getProductById);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  validateProduct,
  createProduct
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  validateProduct,
  updateProduct
);

router.delete("/:id", authenticateToken, requireAdmin, deleteProduct);

export default router;

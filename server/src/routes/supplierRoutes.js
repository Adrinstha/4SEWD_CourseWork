import express from "express";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateSupplier } from "../validators/supplierValidator.js";

const router = express.Router();

router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validateSupplier,
  createSupplier
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validateSupplier,
  updateSupplier
);

router.delete("/:id", authenticateToken, requireAdmin, deleteSupplier);

export default router;

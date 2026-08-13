import { Supplier, Product } from "../models/index.js";

export async function getAllSuppliers(req, res, next) {
  try {
    const suppliers = await Supplier.findAll({
      order: [["id", "ASC"]],
    });
    return res.json(suppliers);
  } catch (error) {
    next(error);
  }
}

export async function getSupplierById(req, res, next) {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id, {
      include: [{ model: Product, as: "products" }],
    });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    return res.json(supplier);
  } catch (error) {
    next(error);
  }
}

export async function createSupplier(req, res, next) {
  try {
    const { name, email, phone, notes } = req.body;

    const newSupplier = await Supplier.create({
      name,
      email,
      phone: phone || null,
      notes: notes || null,
    });

    return res.status(201).json(newSupplier);
  } catch (error) {
    next(error);
  }
}

export async function updateSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, notes } = req.body;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    await supplier.update({
      name: name ?? supplier.name,
      email: email ?? supplier.email,
      phone: phone !== undefined ? phone : supplier.phone,
      notes: notes !== undefined ? notes : supplier.notes,
    });

    return res.json(supplier);
  } catch (error) {
    next(error);
  }
}

export async function deleteSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    // Check foreign key constraint: active products linked to this supplier
    const productCount = await Product.count({ where: { supplierId: id } });
    if (productCount > 0) {
      return res.status(409).json({
        message: `Cannot delete supplier "${supplier.name}" because it has ${productCount} active product(s) associated with it. Please reassign or delete the products first.`,
      });
    }

    await supplier.destroy();
    return res.status(200).json({ message: "Supplier deleted successfully.", id: parseInt(id, 10) });
  } catch (error) {
    next(error);
  }
}

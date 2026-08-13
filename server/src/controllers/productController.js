import { Product, Supplier } from "../models/index.js";

export async function getAllProducts(req, res, next) {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, description, price, quantity, supplierId } = req.body;

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image;
    } else {
      imagePath = "/assets/icons/box.svg";
    }

    // Verify supplier exists
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: { supplierId: "Selected supplier does not exist." },
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      image: imagePath,
      supplierId: parseInt(supplierId, 10),
    });

    const productWithSupplier = await Product.findByPk(newProduct.id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    return res.status(201).json(productWithSupplier);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, supplierId } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (supplierId) {
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(400).json({
          message: "Validation failed.",
          errors: { supplierId: "Selected supplier does not exist." },
        });
      }
    }

    let imagePath = product.image;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image;
    }

    await product.update({
      name: name ?? product.name,
      description: description ?? product.description,
      price: price ? parseFloat(price) : product.price,
      quantity: quantity !== undefined ? parseInt(quantity, 10) : product.quantity,
      image: imagePath,
      supplierId: supplierId ? parseInt(supplierId, 10) : product.supplierId,
    });

    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    await product.destroy();
    return res.status(200).json({ message: "Product deleted successfully.", id: parseInt(id, 10) });
  } catch (error) {
    next(error);
  }
}

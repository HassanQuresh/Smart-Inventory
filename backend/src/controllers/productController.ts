import { Request, Response } from "express";
import Product from "../models/Product";
export async function createProduct(req: Request, res: Response): Promise<Response | void>  {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create product",
    });
  };
};
export async function getProducts(req: Request, res: Response): Promise<Response | void>  {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to retrieve products",
    });
  }
}
export async function getProduct(req: Request, res: Response): Promise<Response | void>  {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to retrieve product",
    });
  }
}
export async function replaceProduct(req: Request, res: Response): Promise<Response | void>  {
  try {
    if (
      !req.body.name ||
      !req.body.price ||
      req.body.stock === undefined ||
      !req.body.category
    ) {
      return res.status(400).json({
        message: "Incomplete information",
      });
    }
    const replacedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, overwrite: true, runValidators: true },
    );
    if (!replacedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json(replacedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Replacement failed",
    });
  }
}
export async function updateProduct(req: Request, res: Response): Promise<Response | void>  {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "No update data provided",
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product", error);
    return res.status(500).json({
      message: "Update failed",
    });
  }
}
export async function deleteProduct(req: Request, res: Response): Promise<Response | void> {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json({
      message: "Product deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Error deleting product", error);
    return res.status(500).json({
      message: "Delete failed",
    });
  }
}

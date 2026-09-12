import { Request, Response, NextFunction } from "express";
import Product from "../models/Product";
export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}
export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}
export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}
export async function replaceProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
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
    next(error);
  }
}
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
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
    next(error);
  }
}
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
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
    next(error);
  }
}
export async function updateStock(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const { id } = req.params;
    const { change } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: id,
        ...(change < 0 ? { stock: { $gte: Math.abs(change) } } : {}),
      },
      {
        $inc: { stock: change },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedProduct) {
      res.status(404).json({
        message: "Product not found or insufficient stock",
      });
      return;
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

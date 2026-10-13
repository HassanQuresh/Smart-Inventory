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
    const replacedProduct = await Product.findOneAndReplace(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true },
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
      const exists = await Product.exists({ _id: id });
      if (!exists) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(409).json({ message: "Insufficient stock" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
}
export const getPublicInventoryStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [result] = await Product.aggregate([
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalUnits: { $sum: "$stock" },
                inventoryValue: {
                  $sum: { $multiply: ["$price", "$stock"] },
                },
              },
            },
          ],
          categories: [
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1, _id: 1 } },
          ],
        },
      },
    ]);

    const summary = result?.summary?.[0] ?? {
      totalProducts: 0,
      totalUnits: 0,
      inventoryValue: 0,
    };

    const totalProducts = summary.totalProducts;

    const categories = result.categories.map(
      (category: { _id: string; count: number }) => ({
        name: category._id,
        count: category.count,
        percentage:
          totalProducts === 0
            ? 0
            : Math.round((category.count / totalProducts) * 100),
      }),
    );

    return res.status(200).json({
      totalProducts,
      totalUnits: summary.totalUnits,
      inventoryValue: summary.inventoryValue,
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    return next(error);
  }
};

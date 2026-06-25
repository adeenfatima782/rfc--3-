import express from "express";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// ✅ 1. GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", category = "" } = req.query;
    
    // Numbers ko process karte waqt fail-safe filters lagaye hain
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);

    const query = {
      name: { $regex: search, $options: "i" },
      ...(category && category !== "All" && { category }),
    };

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit);

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalProducts / parsedLimit),
      totalProducts,
    });
  } catch (err) {
    console.error("❌ GET PRODUCTS ERROR:", err);
    next(err); // Server.js ke error logger ko bhejega
  }
});

// ✅ 2. GET SINGLE PRODUCT
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("❌ GET SINGLE PRODUCT ERROR:", err);
    next(err);
  }
});

// ✅ 3. ADD PRODUCT (Admin Protected)
router.post("/", auth, admin, async (req, res, next) => {
  try {
    const { name, price, image, category, stock, tags, isBestSeller, isTopDeal } = req.body;
    
    if (!name || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "Name, price and image are required",
      });
    }

    const product = new Product({
      name,
      price,
      image,
      category,
      stock: stock || 0,
      tags: tags || [],
      isBestSeller: isBestSeller || false,
      isTopDeal: isTopDeal || false,
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    console.error("❌ ADD PRODUCT ERROR:", err);
    next(err);
  }
});

// ✅ 4. UPDATE PRODUCT (Admin Protected)
router.put("/:id", auth, admin, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("❌ UPDATE PRODUCT ERROR:", err);
    next(err);
  }
});

// ✅ 5. DELETE PRODUCT (Admin Protected)
router.delete("/:id", auth, admin, async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("❌ DELETE PRODUCT ERROR:", err);
    next(err);
  }
});

// ✅ 6. ADD PRODUCT REVIEW
router.post("/:id/reviews", auth, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Array initialization checks if reviews block is missing in document schema
    if (!product.reviews) {
      product.reviews = [];
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.userId && review.userId.toString() === req.userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed",
      });
    }

    const review = {
      name: req.user?.name || "User",
      rating: Number(rating),
      comment,
      userId: req.userId,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (err) {
    console.error("❌ ADD REVIEW ERROR:", err);
    next(err);
  }
});

export default router;

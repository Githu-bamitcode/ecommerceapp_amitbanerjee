import { Product } from "../models/productModel.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "./../utils/cloudinary.js";
import { Cart } from "../models/cartModel.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //Handle multiple image uploads
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products", // cloudinary folder name
        });

        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    //create a product in DB
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg, // array of objects [{url, public_id}]
    });

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "No product available",
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mesage: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Remove product from ALL carts
    await Cart.updateMany(
      {},
      {
        $pull: { items: { productId: productId } },
      },
    );
    const carts = await Cart.find();

    for (let cart of carts) {
      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      await cart.save();
    }

    // Delete images from cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: "Prooduct deleted & removed from all carts",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    let updatedImages = [];

    // keep selected old images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);
      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );

      // delete only removed images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );
      for (let img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = product.productImg; // keep all if nothing sent
    }

    // upload new images if any
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });
        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // Track old price before updating
    const oldPrice = product.productPrice;

    // update product
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;

    await product.save();

    // CART SYNC LOGIC STARTS HERE
    // Only run if price actually changed
    if (productPrice && productPrice !== oldPrice) {
      const carts = await Cart.find({
        "items.productId": productId,
      });

      for (let cart of carts) {
        let newTotal = 0;

        cart.items = cart.items.map((item) => {
          if (item.productId.toString() === productId) {
            item.price = product.productPrice; // update price

            // Set quantity to 0 if price is 0
            if (product.productPrice === 0) {
              item.quantity = 0;
            }
          }

          newTotal += item.price * item.quantity;
          return item;
        });

        cart.totalPrice = newTotal;
        await cart.save();
      }
    }

    // CART SYNC LOGIC ENDS HERE
    return res.status(200).json({
      success: true,
      message: "Product updated & carts synced successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

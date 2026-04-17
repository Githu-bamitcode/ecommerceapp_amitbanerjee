import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, quantity, price } = req.body;

    // Validate quantity
    const qty = Number(quantity) || 1;

    //check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds stock",
      });
    }

    // find the user's cart if exists
    let cart = await Cart.findOne({ userId });

    // if cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: qty,
            price: product.productPrice, // Always from DB
          },
        ],
        totalPrice: product.productPrice * qty,
      });
    } else {
      // Find if product is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex > -1) {
        // EXISTING ITEM → ADD quantity
        const newQty = cart.items[itemIndex].quantity + qty;

        if (newQty > product.stock) {
          return res.status(400).json({
            success: false,
            message: "Exceeds available stock",
          });
        }

        // if product exist then just increase quantity
        cart.items[itemIndex].quantity = newQty;
        cart.items[itemIndex].price = product.productPrice;
      } else {
        // if new product then push to cart
        cart.items.push({
          productId,
          quantity: qty,
          price: product.productPrice,
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + (item.price || 0) * item.quantity,
        0,
      );
    }
    // Save updated cart
    await cart.save();

    // Populate product details before sending response
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    res.status(200).json({
      success: true,
      message: "Product added to Cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (type === "increase") {
      if (item.quantity + 1 > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Stock limit reached",
        });
      }
      item.quantity += 1;
      item.price = product.productPrice;
    }

    if (type === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
      item.price = product.productPrice;
    }
    //    if (type === "increase") item.quantity += 1;
    //    if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();
    cart = await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    //    cart = await cart.populate("items.productId");

    await cart.save();
    cart = await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

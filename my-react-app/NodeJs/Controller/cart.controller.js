import Cart from "../Model/cart.model.js";
import mongoose from "mongoose";

export async function getCart(req, res) {
  const cart = await Cart.findOne({ userId: req.user._id })
    .populate("items.productId", "title price images");

  res.status(200).json({
    cart: cart || { items: [] },
  });
}

export async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    cart = new Cart({
      userId: req.user._id,
      items: [{ productId, quantity }],
    });
  } else {
    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (item) {
      item.quantity += Number(quantity);
    } else {
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();

  const populated = await Cart.findById(cart._id)
    .populate("items.productId", "title price images");

  res.json({ cart: populated });
}

export async function updateQuantity(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔥 IMPORTANT FIX
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1); // remove item
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate("items.productId", "title price images");

    return res.status(200).json({ cart: populated });

  } catch (err) {
    console.error("UPDATE QTY ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}

export async function removeItem(req, res) {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate("items.productId", "title price images");

    return res.status(200).json({ cart: populated });
  } catch (err) {
    console.error("REMOVE ITEM ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}

export async function clearCartBackend(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ items: [] });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
}




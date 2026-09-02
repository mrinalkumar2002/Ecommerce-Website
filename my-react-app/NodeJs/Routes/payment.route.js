import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Product from "../Model/products.model.js";
import mongoose from "mongoose";

dotenv.config();

const router = express.Router();

function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  return new Razorpay({ key_id, key_secret });
}

// 1. Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, items } = req.body;
    let verifiedAmount = Number(amount);

    // If items are provided, verify and recalculate authoritative price on server
    if (items && Array.isArray(items) && items.length > 0) {
      let serverCalculatedTotal = 0;

      for (const item of items) {
        const prodId = String(item.productId || item._id || item.id);
        const qty = Math.max(1, Number(item.quantity || 1));

        let dbProduct = null;
        if (mongoose.connection.readyState === 1) {
          try {
            dbProduct = await Product.findById(prodId).lean();
          } catch (e) {}
        }

        const unitPrice = dbProduct?.price ? Number(dbProduct.price) : Number(item.price || 0);
        serverCalculatedTotal += unitPrice * qty;
      }

      if (serverCalculatedTotal > 0) {
        verifiedAmount = serverCalculatedTotal;
      }
    }

    if (!verifiedAmount || verifiedAmount <= 0) {
      return res.status(400).json({ success: false, message: "Valid order amount is required" });
    }

    const razorpayInstance = getRazorpayInstance();
    if (!razorpayInstance) {
      // In development / demo mode when Razorpay credentials are not configured in environment
      return res.status(200).json({
        success: true,
        order: {
          id: "mock_order_" + Date.now(),
          amount: Math.round(verifiedAmount * 100),
          currency: "INR",
        },
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
        isMock: true,
      });
    }

    // Razorpay limit: ₹5,00,000 (50,00,000 paise)
    let rawPaise = Math.round(verifiedAmount * 100);
    const maxPaiseAllowed = 50000000;
    const finalAmountInPaise = Math.min(rawPaise, maxPaiseAllowed);

    const options = {
      amount: finalAmountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error?.error || error);
    const errorMsg = error?.error?.description || error.message || "Could not create Razorpay order";
    res.status(500).json({ success: false, message: errorMsg, error });
  }
});

// 2. Verify Razorpay Payment Signature
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      // In dev without Razorpay secret configured, verify mock transactions safely
      if (razorpay_order_id?.startsWith("mock_order_")) {
        return res.status(200).json({ success: true, message: "Mock payment verified successfully" });
      }
      return res.status(500).json({ success: false, message: "Payment gateway secret not configured" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

export default router;

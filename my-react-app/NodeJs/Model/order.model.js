import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, index: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: "Online (Razorpay)" },
    paymentId: { type: String, default: "" },
    status: { type: String, default: "Confirmed" },
    shippingAddress: { type: Object, default: {} },
    customer: { type: Object, default: {} },
    couponCode: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;

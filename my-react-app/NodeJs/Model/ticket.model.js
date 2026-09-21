import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "authuser" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    productName: { type: String, default: "General Inquiry / Other" },
    productId: { type: String, default: null },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);

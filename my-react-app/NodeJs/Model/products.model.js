import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  images: {
    type: [String],
    default: []
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  }
});

const Product = mongoose.model("Product", ProductSchema, "products");

export default Product;

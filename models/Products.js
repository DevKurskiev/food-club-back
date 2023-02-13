import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  kinds: {
    type: Array,
    required: true,
  },
});

export default mongoose.model("Product", ProductsSchema);

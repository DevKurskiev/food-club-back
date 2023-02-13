import mongoose from "mongoose";

const BasketSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  inBasket: {
    type: Array,
    required: true,
  },
});

export default mongoose.model("Basket", BasketSchema);

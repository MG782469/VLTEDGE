import mongoose, {Schema} from "mongoose";

const ProductSchema = new mongoose.Schema({
  userId: {type:String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true,enum: ['Dairy', 'Grocery', 'Medicine', 'Personal Care', 'Beverages', 'Other'],default: 'Other'},
  image:{type:String},
  purchaseDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
});
export const Product = mongoose.model("Product", ProductSchema);

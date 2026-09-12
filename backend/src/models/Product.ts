import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: [0.01, "Price must be at least $0.01"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock must not be negative"],
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    category: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value){
          return value.length > 0
        }, 
        message: "Category can not be empty or just spaces"
      }
    },
  },
  {
    timestamps: true,
  },
);
const Product = mongoose.model("Product", productSchema);
export default Product;

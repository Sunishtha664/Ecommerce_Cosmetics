import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.ObjectId,
        ref: "Category",
        required: true,
    },
    subcategory: {
        type: mongoose.ObjectId,
        ref: "Subcategory",
    },
    section: {
        type: mongoose.ObjectId,
        ref: "Section",
    },
    quantity: {
        type: Number,
        required: true,
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    shipping: {
        type: Boolean,
    },

}, { timestamps: true })
export default mongoose.model("Products", productSchema)
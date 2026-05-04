import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    slug: {
        type: String,
        lowercase: true,
        unique: true,
    },
    parentCategory: {
        type: mongoose.ObjectId,
        ref: "Category",
        required: false,
    },
}, { timestamps: true });

export default mongoose.model('Subcategory', subcategorySchema);
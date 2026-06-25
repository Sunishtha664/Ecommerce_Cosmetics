import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
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
    parentSubcategory: {
        type: mongoose.ObjectId,
        ref: 'Subcategory',
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Section', sectionSchema);
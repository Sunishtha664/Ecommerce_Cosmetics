import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
            },
            name: String,
            price: Number,
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    amount: {
        type: Number,
        required: true,
    },
    address: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    transactionId: String,
    paymentDetails: {
        type: Object,
        default: {},
    },
    status: {
        type: String,
        default: 'completed',
    },
}, { timestamps: true });

export default mongoose.model('orders', orderSchema);

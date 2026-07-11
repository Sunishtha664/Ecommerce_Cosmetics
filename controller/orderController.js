import OrderModel from '../models/orderModel.js';

export const verifyKhaltiPaymentController = async (req, res) => {
    try {
        const { token, amount, products } = req.body;
        const userId = req.user._id;

        if (!token || !amount || !products?.length) {
            return res.status(400).send({
                success: false,
                message: 'Payment token, amount, and products are required',
            });
        }

        const khaltiSecretKey = process.env.KHALTI_SECRET_KEY;
        if (!khaltiSecretKey) {
            return res.status(500).send({
                success: false,
                message: 'Khalti secret key is not configured on the server',
            });
        }

        // Dynamically select sandbox or production endpoint
        const isTestKey = khaltiSecretKey.startsWith('test_') || khaltiSecretKey.includes('test');
        const verificationUrl = isTestKey
            ? 'https://dev.khalti.com/api/v2/payment/verify/'
            : 'https://khalti.com/api/v2/payment/verify/';

        const response = await fetch(verificationUrl, {
            method: 'POST',
            headers: {
                Authorization: `Key ${khaltiSecretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, amount }),
        });

        const data = await response.json();

        if (!response.ok || data.status !== 200) {
            return res.status(400).send({
                success: false,
                message: 'Khalti payment verification failed',
                error: data,
            });
        }

        const orderProducts = products.map((item) => ({
            product: item._id || item.product?._id || null,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
        }));

        const order = await new OrderModel({
            user: userId,
            products: orderProducts,
            amount,
            address: req.user.address || '',
            paymentStatus: 'paid',
            transactionId: data.idx,
            paymentDetails: data,
            status: 'completed',
        }).save();

        res.status(200).send({
            success: true,
            message: 'Payment verified and order created successfully',
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error verifying Khalti payment',
            error,
        });
    }
};

export const getUserOrdersController = async (req, res) => {
    try {
        const orders = await OrderModel.find({ user: req.user._id }).populate('products.product', 'name price');
        res.status(200).send({
            success: true,
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Unable to fetch user orders',
            error,
        });
    }
};

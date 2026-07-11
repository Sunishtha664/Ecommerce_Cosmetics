import Stripe from 'stripe';
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

export const createStripeCheckoutSessionController = async (req, res) => {
    try {
        const { products } = req.body;
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!products?.length) {
            return res.status(400).send({
                success: false,
                message: 'Products are required to create a Stripe checkout session',
            });
        }

        if (!stripeSecretKey) {
            return res.status(500).send({
                success: false,
                message: 'Stripe secret key is not configured on the server',
            });
        }

        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' });
        const origin = req.headers.origin || process.env.CLIENT_URL || 'http://localhost:3000';

        const line_items = products.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    description: item.description?.substring(0, 120) || 'Cosmetics product',
                },
                unit_amount: Math.round((item.price || 0) * 100),
            },
            quantity: item.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: `${origin}/cart?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart?canceled=true`,
            metadata: {
                userId: req.user._id.toString(),
            },
        });

        res.status(200).send({
            success: true,
            sessionId: session.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error creating Stripe checkout session',
            error,
        });
    }
};

export const verifyStripePaymentController = async (req, res) => {
    try {
        const { sessionId, products } = req.body;
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!sessionId) {
            return res.status(400).send({
                success: false,
                message: 'Stripe session ID is required',
            });
        }

        if (!products?.length) {
            return res.status(400).send({
                success: false,
                message: 'Products are required for Stripe payment verification',
            });
        }

        if (!stripeSecretKey) {
            return res.status(500).send({
                success: false,
                message: 'Stripe secret key is not configured on the server',
            });
        }

        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' });
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session || session.payment_status !== 'paid') {
            return res.status(400).send({
                success: false,
                message: 'Stripe payment was not completed',
                paymentStatus: session?.payment_status,
            });
        }

        const existingOrder = await OrderModel.findOne({ transactionId: session.id });
        if (existingOrder) {
            return res.status(200).send({
                success: true,
                message: 'Order already exists',
                order: existingOrder,
            });
        }

        const orderProducts = products.map((item) => ({
            product: item._id || item.product?._id || null,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
        }));

        const order = await new OrderModel({
            user: req.user._id,
            products: orderProducts,
            amount: session.amount_total || orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0),
            address: req.user.address || '',
            paymentStatus: 'paid',
            transactionId: session.id,
            paymentDetails: session,
            status: 'completed',
        }).save();

        res.status(200).send({
            success: true,
            message: 'Stripe payment verified and order created successfully',
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error verifying Stripe payment',
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

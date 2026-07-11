import React, { useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartPage = () => {
    const API = process.env.REACT_APP_API || ''
    const khaltiPublicKey = process.env.REACT_APP_KHALTI_PUBLIC_KEY || ''
    const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY || ''

    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const totalPrice = () => {
        try {
            return cart?.reduce((total, item) => total + (item.price || 0), 0) || 0;
        } catch (error) {
            console.log(error)
            return 0;
        }
    }

    const removeCartItem = (pid) => {
        try {
            const myCart = [...cart]
            const index = myCart.findIndex(item => item._id === pid)
            if (index !== -1) {
                myCart.splice(index, 1)
                setCart(myCart)
                localStorage.setItem('cart', JSON.stringify(myCart))
                toast.success('Item removed from cart')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const ensureKhaltiCheckout = async () => {
        if (window.KhaltiCheckout) return;

        await new Promise((resolve, reject) => {
            const existingScript = document.querySelector('script[src="https://khalti.com/static/khalti-checkout.js"]');
            if (existingScript) {
                existingScript.onload = resolve;
                existingScript.onerror = () => reject(new Error('Unable to load Khalti checkout script.'));
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://khalti.com/static/khalti-checkout.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Unable to load Khalti checkout script. This is usually caused by a network, firewall, VPN, or ad-blocker restriction.'));
            document.body.appendChild(script);
        });
    };

    const handleKhaltiCheckout = async () => {
        if (!auth?.token) {
            return navigate('/login', { state: '/cart' });
        }

        if (!auth?.user?.address) {
            toast.info('Please update your address before checkout')
            return navigate('/dashboard/user/profile')
        }

        if (!cart?.length) {
            return toast.info('Add items to cart before checkout')
        }

        if (!khaltiPublicKey) {
            return toast.error('Khalti public key is not configured')
        }

        setLoading(true)

        try {
            await ensureKhaltiCheckout();

            if (!window.KhaltiCheckout) {
                throw new Error('Khalti checkout failed to load. Refresh the page and try again.')
            }

            const amount = totalPrice();
            const amountInPaisa = amount * 100;
            const returnUrl = process.env.REACT_APP_KHALTI_RETURN_URL || window.location.href;

            const config = {
                publicKey: khaltiPublicKey,
                productIdentity: 'COSMETICS_CART',
                productName: 'Cosmetics Order',
                productUrl: returnUrl,
                eventHandler: {
                    onSuccess: async (payload) => {
                        try {
                            setLoading(true)
                            const { data } = await axios.post(`${API}/api/v1/order/khalti/verify`, {
                                token: payload.token,
                                amount: amountInPaisa,
                                products: cart,
                            });

                            if (data?.success) {
                                setCart([])
                                localStorage.removeItem('cart')
                                toast.success('Payment successful. Order created.')
                                navigate('/dashboard/user/orders')
                            } else {
                                toast.error(data?.message || 'Payment verification failed')
                            }
                        } catch (error) {
                            console.error(error)
                            toast.error('Payment verification failed. Please try again.')
                        } finally {
                            setLoading(false)
                        }
                    },
                    onError: (error) => {
                        console.error('Khalti checkout error:', error)
                        toast.error('Khalti payment process was interrupted.')
                    },
                    onClose: () => {
                        toast.info('Khalti payment window closed.')
                    },
                },
                paymentPreference: ['KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT'],
                amount: amountInPaisa,
            }

            const checkout = new window.KhaltiCheckout(config)
            checkout.show({ amount: amountInPaisa })
        } catch (error) {
            console.error('Khalti checkout error:', error)
            toast.error(error?.message || 'Khalti payment process was interrupted.')
        } finally {
            setLoading(false)
        }
    }

    const handleStripeCheckout = async () => {
        if (!auth?.token) {
            return navigate('/login', { state: '/cart' });
        }

        if (!auth?.user?.address) {
            toast.info('Please update your address before checkout')
            return navigate('/dashboard/user/profile')
        }

        if (!cart?.length) {
            return toast.info('Add items to cart before checkout')
        }

        if (!stripePublicKey) {
            return toast.error('Stripe public key is not configured')
        }

        try {
            setLoading(true)
            const { data } = await axios.post(`${API}/api/v1/order/stripe/create-session`, {
                products: cart,
            });

            if (!data?.success || !data?.sessionId) {
                return toast.error(data?.message || 'Unable to create Stripe checkout session')
            }

            const stripe = window.Stripe(stripePublicKey)
            await stripe.redirectToCheckout({ sessionId: data.sessionId })
        } catch (error) {
            console.error('Stripe checkout error:', error)
            toast.error('Unable to start Stripe checkout. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="container mt-3">

                <div className="row">
                    <div className="col-md-12">
                        <h1 className='text-center bg-light p-2 mb-1'>{`Hello ${auth?.token ? auth?.user?.name : 'Guest'}`}</h1>
                        <h4 className='text-center'>{cart?.length ? `You have ${cart.length} item${cart.length > 1 ? 's' : ''} in your cart ${auth?.token ? '' : 'please login to checkout'}` : 'Your cart is empty'}</h4>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-8'>
                        {cart?.length ? cart.map(p => (
                            <div key={p._id} className='row mb-2 p-3 card flex-row'>
                                <div className='col-md-4'>
                                    <img
                                        src={`${API}/api/v1/product/product-photo/${p._id}?${Date.now()}`}
                                        className="card-img-top"
                                        alt={p.name}
                                        width="100px"
                                        height={"50px"}
                                    />
                                </div>
                                <div className='col-md-8'>
                                    <b>{p.name}</b>
                                    <p>{p.description?.substring(0, 30)}</p>
                                    <h4>Price: रु{p.price}</h4>
                                    <button className='btn btn-danger' onClick={() => removeCartItem(p._id)}>Remove</button>
                                </div>
                            </div>
                        )) : (
                            <div className='alert alert-info'>Your cart is empty.</div>
                        )}
                    </div>
                    <div className='col-md-4 text-center'>
                        <div className='card p-3'>
                            <h2>Cart Summary</h2>
                            <p>TOTAL | CHECKOUT | PAYMENT</p>
                            <hr />
                            <h4>Total: रु{totalPrice()}</h4>

                            {auth?.user?.address ? (
                                <>
                                    <div className='mb-3'>
                                        <h4>Current Address</h4>
                                        <h5>{auth?.user?.address}</h5>
                                        <button className='btn btn-outline-warning mb-3' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                                    </div>
                                </>
                            ) : (
                                <div className='mb-3'>
                                    {auth?.token ? (
                                        <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                                    ) : (
                                        <button className='btn btn-outline-warning' onClick={() => navigate('/login', { state: '/cart' })}>Please Login to Checkout</button>
                                    )}
                                </div>
                            )}

                            <button
                                className='btn btn-primary btn-lg w-100 mb-2'
                                onClick={handleKhaltiCheckout}
                                disabled={!cart?.length || !auth?.token || !auth?.user?.address || loading}
                            >
                                {loading ? 'Processing payment...' : 'Pay with Khalti'}
                            </button>

                            <button
                                className='btn btn-success btn-lg w-100'
                                onClick={handleStripeCheckout}
                                disabled={!cart?.length || !auth?.token || !auth?.user?.address || loading}
                            >
                                {loading ? 'Processing payment...' : 'Pay with Stripe'}
                            </button>

                            {!khaltiPublicKey && (
                                <p className='text-danger mt-3'>Khalti public key missing. Add REACT_APP_KHALTI_PUBLIC_KEY to .env.</p>
                            )}
                            {!stripePublicKey && (
                                <p className='text-danger mt-3'>Stripe public key missing. Add REACT_APP_STRIPE_PUBLIC_KEY to .env.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </Layout >
    )
}

export default CartPage

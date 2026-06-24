import React from 'react'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
    const API = process.env.REACT_APP_API || ''

    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();

    const totalPrice = () => {
        try {
            let total = 0
            cart?.map(item => { total = total + item.price })
            return total;
        } catch (error) {
            console.log(error)
        }
    }

    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid)
            myCart.splice(index, 1)
            setCart(myCart)

            localStorage.setItem('cart', JSON.stringify(myCart))
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Layout>
            <div className="container mt-3">

                <div className="row">
                    <div className="col-md-12">
                        <h1 className='text-center bg-light p-2 mb-1'>{`Hello ${auth?.token && auth?.user?.name}`}</h1>
                        <h4 className='text-center'>{cart?.length ? `You have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout"}` : "Your cart is empty"}</h4>

                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-8'>
                        {
                            cart?.map(p => (
                                <div className='row mb-2 p-3 card flex-row'>
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
                                        <p>{p.description.substring(0, 30)}</p>
                                        <h4>Price: रु{p.price}</h4>
                                        <button className='btn btn-danger' onClick={() => removeCartItem(p._id)}>Remove</button>
                                    </div>
                                </div>

                            ))
                        }
                    </div>
                    <div className='col-md-4 text-center'>
                        <h2>Cart Summary</h2>
                        <p>TOTAL | CHECKOUT | PAYMENT</p>
                        <hr />

                        <h4>Total: रु{totalPrice()}</h4>
                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default CartPage

import React, { useState, useEffect } from 'react'
import Layout from './../components/Layout/Layout'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { toast } from 'react-toastify';
import { FaEye, FaShoppingCart } from 'react-icons/fa';

const ProductDetails = () => {
    const params = useParams()
    const [product, setProduct] = useState({})
    const navigate = useNavigate()
    const [relatedProducts, setRelatedProducts] = useState([])
    const [cart, setCart] = useCart()
    const API = process.env.REACT_APP_API || ''

    //initial p details
    useEffect(() => {
        if (params?.slug) getProduct()
    }, [params?.slug])

    //getproduct
    const getProduct = async () => {
        try {
            // API endpoint to get product details by slug
            const res = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            if (res.data?.success) {
                setProduct(res.data?.product || {});
                getSimilarProduct(res.data?.product?._id, res.data?.product?.category?._id || res.data?.product?.category);
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    //get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            if (!pid || !cid) return;
            const res = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(res.data?.products || []);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout title={`${product.name || 'Product Details'} - Luminelle`}>
            <div className="row container mt-4">
                <div className="col-md-6 text-center">
                    <img
                        src={`${API}/api/v1/product/product-photo/${product._id}`}
                        className="card-img-top img-fluid rounded" 
                        alt={product.name} 
                        style={{ maxHeight: '400px', objectFit: 'contain' }} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400?text=No+Image' }}
                    />
                </div>
                <div className="col-md-6" >
                    <h1 className="page-title mb-4">Product Details</h1>
                    <h4>Name : {product.name}</h4>
                    <p className="text-muted fs-5">Description : {product.description}</p>
                    <h5>Brand : <span className="text-primary">{product.brand}</span></h5>
                    <h5 className="text-accent fw-bold fs-4 my-3">Price : रु{product.price}</h5>
                    <h5>Category : {product?.category?.name}</h5>
                    <h5>Subcategory : {product?.subcategory?.name}</h5>
                    <h5>Section : {product?.section?.name || 'None'}</h5>

                    <button 
                        className="btn btn-secondary ms-1 px-4 py-2 mt-3"
                        onClick={() => {
                            setCart([...cart, product]);
                            localStorage.setItem('cart', JSON.stringify([...cart, product]));
                            toast.success("Item added to cart");
                        }}
                    >
                        ADD TO CART
                    </button>
                </div>

                <hr className="my-5" />

                <div className="row">
                    <h2 className="section-heading text-center mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                        Similar Products
                    </h2>
                    {relatedProducts?.length < 1 && <p className="text-center text-muted">No Similar Products Found</p>}
                    
                    <div className="d-flex flex-wrap gap-4 justification-content-center px-2">
                        {relatedProducts?.map((p) => (
                            <div key={p._id} className="scroll-product-card">
                                <div className="scroll-card-img-wrapper">
                                    <img
                                        src={`${API}/api/v1/product/product-photo/${p._id}?${Date.now()}`}
                                        alt={p.name}
                                        onError={(e) => { 
                                            e.target.onerror = null; 
                                            e.target.src = 'https://via.placeholder.com/286x180?text=No+Image' 
                                        }}
                                    />
                                    {p.category?.name && (
                                        <span className="scroll-card-badge">
                                            {p.category.name}
                                        </span>
                                    )}
                                </div>
                                <div className="scroll-card-body">
                                    <div className="scroll-card-info">
                                        <span className="scroll-card-brand">Luminelle</span>
                                        <h5 className="scroll-card-title">{p.name}</h5>
                                        <p className="scroll-card-description">{p.description?.substring(0, 50)}...</p>
                                    </div>
                                    
                                    <div className="scroll-card-footer">
                                        <div className="price-container">
                                            <span className="price-label">Price</span>
                                            <span className="price-value">रु{p.price}</span>
                                        </div>
                                        <div className="card-actions-btn-group">
                                            <button 
                                                className="btn-details-icon" 
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                                title="View Details"
                                            >
                                                <FaEye size={13} />
                                            </button>
                                            <button 
                                                className="btn-add-cart-icon"
                                                onClick={() => {
                                                    setCart([...cart, p]);
                                                    localStorage.setItem('cart', JSON.stringify([...cart, p]));
                                                    toast.success("Item added to cart");
                                                }}
                                                title="Add to Cart"
                                            >
                                                <FaShoppingCart size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails

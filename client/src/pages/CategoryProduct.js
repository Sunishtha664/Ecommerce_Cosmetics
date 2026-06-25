import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { toast } from 'react-toastify';
import { FaEye, FaShoppingCart } from 'react-icons/fa';

const CategoryProduct = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [cart, setCart] = useCart();
    const params = useParams();
    const navigate = useNavigate();
    const API = process.env.REACT_APP_API || '';

    const getProductsByCategory = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products || []);
            setCategory(data?.category || null);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (params?.slug) getProductsByCategory();
    }, [params?.slug])

    return (
        <Layout title={`${category?.name || 'Category'} - Luminelle`}>
            <div className="container mt-4">
                <div className="text-center mb-4 subcategory-header-clean">
                    <h1 className="page-title mb-1">{category?.name}</h1>
                    <span className="badge badge-glass mt-2">{products?.length} Results Found</span>
                </div>
                
                <div className="d-flex flex-wrap gap-4 justification-content-start px-2 mt-2">
                    {products?.map((p) => (
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
                                {category?.name && (
                                    <span className="scroll-card-badge">
                                        {category.name}
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
        </Layout>
    )
}

export default CategoryProduct

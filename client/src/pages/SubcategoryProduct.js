import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { toast } from 'react-toastify';
import { FaEye, FaShoppingCart } from 'react-icons/fa';

const SubcategoryProduct = () => {
    const [products, setProducts] = useState([]);
    const [subcategory, setSubcategory] = useState(null);
    const [cart, setCart] = useCart();
    const params = useParams();
    const navigate = useNavigate();
    const API = process.env.REACT_APP_API || '';

    const getProductsBySubcategory = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-subcategory/${params.slug}`);
            setProducts(data?.products || []);
            setSubcategory(data?.subcategory || null);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (params?.slug) getProductsBySubcategory();
    }, [params?.slug])

    const sectionGroups = products?.reduce((groups, product) => {
        const key = product.section?._id || 'no-section'
        const sectionName = product.section?.name || 'Unassigned'
        if (!groups[key]) {
            groups[key] = {
                name: sectionName,
                products: []
            }
        }
        groups[key].products.push(product)
        return groups
    }, {}) || {}

    return (
        <Layout title={`${subcategory?.name || 'Subcategory'} - Luminelle`}>
            <div className="container mt-4">
                <div className="text-center mb-4 subcategory-header-clean">
                    <h1 className="page-title mb-1">{subcategory?.name}</h1>
                    <p className="text-muted mb-0">
                        Category: <span className="text-dark fw-semibold">{subcategory?.parentCategory?.name}</span> • <span className="products-count-badge ms-1">{products?.length} Results</span>
                    </p>
                </div>

                {Object.values(sectionGroups).map((group) => (
                    <div key={group.name} className="subcategory-section-wrapper mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                            <div className="section-title-container">
                                <h3 className="section-heading mb-0">{group.name}</h3>
                                <div className="section-subtitle-line"></div>
                            </div>
                            <span className="products-count-badge">{group.products.length} Products</span>
                        </div>
                        
                        <div className="position-relative scroll-container-outer">
                            <div className="product-scroll-container">
                                {group.products.map((p) => (
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
                                            {subcategory?.name && (
                                                <span className="scroll-card-badge">
                                                    {subcategory.name}
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
                ))}

                {!products?.length && (
                    <div className="text-center py-5 text-muted">
                        <h3>No products found for this subcategory.</h3>
                        <p>Please check back later or browse other categories.</p>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default SubcategoryProduct

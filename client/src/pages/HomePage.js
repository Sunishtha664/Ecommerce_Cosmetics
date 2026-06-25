import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Routes/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { toast } from 'react-toastify';
import { FaEye, FaShoppingCart } from 'react-icons/fa';

const HomePage = () => {
    const API = process.env.REACT_APP_API || ''

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useCart();


    //get all categories
    const getAllCategories = async () => {
        try {
            const res = await axios.get('/api/v1/category/get-category');
            if (res.data?.success) {
                // API returns 'category' (singular) as the payload key
                setCategories(res.data?.category || []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            // correct endpoint is get-products
            const res = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            if (res.data?.success) {
                setProducts(res.data?.products || []);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    //getTotal count
    const getTotal = async () => {
        try {
            const res = await axios.get('/api/v1/product/product-count');
            if (res.data?.success) {
                setTotal(res.data?.total || 0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);

    //load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            if (res.data?.success) {
                setProducts([...products, ...(res.data?.products || [])]);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    //filter by cat
    const handleFilter = (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id)
        }
        else {
            all = all.filter((c) => c !== id)
        }
        setChecked(all)
    }

    useEffect(() => {
        if (!checked.length || !radio.length) {
            getAllProducts();
            getAllCategories();
            getTotal();
        }
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) {
            filteredProduct();
        }
        else {
            getAllProducts();
        }
    }, [checked, radio]);

    //get filtered product
    const filteredProduct = async () => {
        try {
            const res = await axios.post('/api/v1/product/product-filters', { checked, radio });
            if (res.data?.success) {
                setProducts(res.data?.products || []);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Layout title="Luminelle - Your Beauty Destination">
            <div className="row mt-3">
                <div className="col-md-3">
                    <div className="filters-panel">
                        <div>
                            <h4 className="filter-section-title">Filter By Category</h4>
                            <div className="filter-options-group">
                                {categories?.map((c) => (
                                    <Checkbox 
                                        key={c._id} 
                                        onChange={(e) => handleFilter(e.target.checked, c._id)}
                                    >
                                        {c.name}
                                    </Checkbox>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="filter-section-title">Filter By Price</h4>
                            <div className="filter-options-group">
                                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                                    {Prices?.map((p) => (
                                        <div key={p._id} className="mb-1">
                                            <Radio value={p.array}>{p.name}</Radio>
                                        </div>
                                    ))}
                                </Radio.Group>
                            </div>
                        </div>

                        <button className="btn-reset-filters" onClick={() => window.location.reload()}>
                            Reset Filters
                        </button>
                    </div>
                </div>
                
                <div className="col-md-9">
                    <h2 className="section-heading mb-4 px-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                        Discover Products
                    </h2>
                    
                    <div className="d-flex flex-wrap gap-4 px-2">
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

                    <div className="m-2 p-3 text-center">
                        {products && products.length < total && (
                            <button className="btn btn-warning px-4 py-2" onClick={(e) => {
                                e.preventDefault();
                                setPage(page + 1);
                            }}>
                                {loading ? "Loading..." : "Load More"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage

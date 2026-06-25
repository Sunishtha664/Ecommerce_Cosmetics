import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/search'
import axios from 'axios'
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Routes/Prices'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart'
import { toast } from 'react-toastify'
import { FaEye, FaShoppingCart } from 'react-icons/fa'


const Search = () => {
    const [values] = useSearch()
    const results = Array.isArray(values?.results) ? values.results : []
    const API = process.env.REACT_APP_API || ''
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [checked, setChecked] = useState([])
    const [radio, setRadio] = useState([])
    const [filteredResults, setFilteredResults] = useState([])
    const [cart, setCart] = useCart()

    useEffect(() => {
        setFilteredResults(results)
    }, [results])

    useEffect(() => {
        getAllCategories()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [checked, radio, results])

    const getAllCategories = async () => {
        try {
            const res = await axios.get('/api/v1/category/get-category')
            if (res.data?.success) {
                setCategories(res.data?.category || [])
            }
        } catch (error) {
            console.log(error)
        }
    }

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

    const applyFilters = () => {
        let temp = [...results]
        if (checked.length > 0) {
            temp = temp.filter((p) => checked.includes(p.category?._id || p.category))
        }
        if (radio.length > 0) {
            temp = temp.filter((p) => p.price >= radio[0] && p.price <= radio[1])
        }
        setFilteredResults(temp)
    }

    const resetFilters = () => {
        setChecked([])
        setRadio([])
        setFilteredResults(results)
    }

    return (
        <Layout title="Search Results - Luminelle">
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
                                        checked={checked.includes(c._id)}
                                    >
                                        {c.name}
                                    </Checkbox>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="filter-section-title">Filter By Price</h4>
                            <div className="filter-options-group">
                                <Radio.Group onChange={(e) => setRadio(e.target.value)} value={radio}>
                                    {Prices?.map((p) => (
                                        <div key={p._id} className="mb-1">
                                            <Radio value={p.array}>{p.name}</Radio>
                                        </div>
                                    ))}
                                </Radio.Group>
                            </div>
                        </div>

                        <button className="btn-reset-filters" onClick={resetFilters}>
                            Reset Filters
                        </button>
                    </div>
                </div>

                <div className="col-md-9 text-center">
                    <h1 className="page-title mb-1">Search Results</h1>
                    <span className="badge badge-glass mb-4">
                        {filteredResults.length < 1 ? 'No products found' : `${filteredResults.length} Products Found`}
                    </span>
                    
                    <div className="d-flex flex-wrap gap-4 justification-content-start px-2 mt-2">
                        {filteredResults.map((p) => (
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

export default Search

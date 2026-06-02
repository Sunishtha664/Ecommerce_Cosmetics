import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Routes/Prices';

const HomePage = () => {
    const API = process.env.REACT_APP_API || ''

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);


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
            // correct endpoint is get-products
            const res = await axios.get('/api/v1/product/get-products');
            if (res.data?.success) {
                setProducts(res.data?.products || []);
            }
        } catch (error) {
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
        getAllProducts();
        getAllCategories();
    }, []);




    return (
        <Layout title="Luminelle - Your Beauty Destination">
            <div className="row mt-3">
                <div className="col-md-3">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((c) => (
                            <div key={c._id}>
                                <Checkbox onChange={(e) => handleFilter(e.target.checked, c._id)}>{c.name}</Checkbox>
                            </div>
                        ))}
                    </div>
                    {/* Price Filter */}
                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map((p) => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                </div>
                <div className="col-md-9">
                    {JSON.stringify(radio, null, 4)}
                    <h1 className="text-center">All Products</h1>
                    <div className="d-flex flex-wrap">

                        {products?.map((p) => (

                            <div key={p._id} className="card m-2" style={{ width: '18rem' }}>
                                <img
                                    src={`${API}/api/v1/product/product-photo/${p._id}?${Date.now()}`}
                                    className="card-img-top"
                                    alt={p.name}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/286x180?text=No+Image' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description?.substring(0, 30)}...</p>
                                    <p className="card-text">Price: रु{p.price}</p>
                                    <button className="btn btn-primary ms-1 width-100">More Details</button>
                                    <button className="btn btn-secondary ms-1">ADD TO CART</button>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </Layout >
    )
}


export default HomePage

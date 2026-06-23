import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SubcategoryProduct = () => {
    const [products, setProducts] = useState([]);
    const [subcategory, setSubcategory] = useState(null);
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

    return (
        <Layout>
            <div className="container mt-3">
                <h1 className="text-center">{subcategory?.name}</h1>
                <h5 className="text-center text-muted">Category: {subcategory?.parentCategory?.name}</h5>
                <h4 className="text-center">{products?.length} result found</h4>
                <div className="row">
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
                                    <button className="btn btn-primary ms-1 width-100" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    <button className="btn btn-secondary ms-1">ADD TO CART</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SubcategoryProduct

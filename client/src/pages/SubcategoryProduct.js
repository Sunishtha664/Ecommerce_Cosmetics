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
        <Layout>
            <div className="container mt-3">
                <h1 className="text-center">{subcategory?.name}</h1>
                <h5 className="text-center text-muted">Category: {subcategory?.parentCategory?.name}</h5>
                <h4 className="text-center mb-4">{products?.length} result found</h4>

                {Object.values(sectionGroups).map((group) => (
                    <div key={group.name} className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="mb-0">{group.name}</h4>
                            <span className="text-muted">{group.products.length} products</span>
                        </div>
                        <div className="d-flex overflow-auto pb-3" style={{ gap: '1rem' }}>
                            {group.products.map((p) => (
                                <div key={p._id} className="card" style={{ minWidth: '18rem', flex: '0 0 auto' }}>
                                    <img
                                        src={`${API}/api/v1/product/product-photo/${p._id}?${Date.now()}`}
                                        className="card-img-top"
                                        alt={p.name}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/286x180?text=No+Image' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description?.substring(0, 50)}...</p>
                                        <p className="card-text mb-2">Price: रु{p.price}</p>
                                        <button className="btn btn-primary me-2" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                        <button className="btn btn-secondary">ADD TO CART</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {!products?.length && (
                    <div className="text-center py-5 text-muted">
                        No products found for this subcategory.
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default SubcategoryProduct

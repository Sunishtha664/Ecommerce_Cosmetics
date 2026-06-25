import React, { useState, useEffect } from 'react'
import Layout from './../components/Layout/Layout'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const ProductDetails = () => {
    const params = useParams()
    const [product, setProduct] = useState({})
    const navigate = useNavigate()
    const [relatedProducts, setRelatedProducts] = useState([])
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
            setProduct(res.data?.product || {});
            if (res.data?.success) {
                setProduct(res.data?.product || {});
            }
        }
        catch (error) {
            console.log(error);
        }

    }

    //get similar products
    const getSimilarProducts = async (pid, cid) => {
        try {
            const res = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
            if (res.data?.success) {
                setRelatedProducts(res.data?.products || []);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (product?._id && product?.category?._id) {
            getSimilarProducts(product._id, product.category._id)
        }
    }, [product?._id, product?.category?._id])

    return (
        <Layout>
            <div className="row container mt-2">
                <div className="col-md-6">
                    <img src={`${API}/api/v1/product/product-photo/${product._id}`}
                        className="card-img-top" alt={product.name} height="400px" width="150px" />


                </div>
                <div className="col-md-6 " >

                    <h1 className="text-center">Product Details</h1>
                    <h4>Name : {product.name}</h4>
                    <h4>Description : {product.description}</h4>
                    <h4>Brand : {product.brand}</h4>
                    <h4>Price : रु{product.price}</h4>
                    <h4>Category : {product?.category?.name}</h4>
                    <h4>Subcategory : {product?.subcategory?.name}</h4>
                    <h4>Section : {product?.section?.name || 'None'}</h4>

                    <button className="btn btn-secondary ms-1">ADD TO CART</button>
                </div>

                <div className="row">
                    <h1 className="text-center">Similar Products</h1>
                    {relatedProducts?.length < 1 && <p className="text-center">No Similar Products Found</p>}
                    <div className="d-flex flex-wrap">
                        {relatedProducts?.map((p) => (
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
        </Layout >
    )
}

export default ProductDetails

import React, { useState, useEffect } from 'react'
import Layout from './../components/Layout/Layout'
import axios from 'axios';
import { useParams } from 'react-router-dom';


const ProductDetails = () => {
    const params = useParams()
    const [product, setProduct] = useState({})

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
    return (
        <Layout>
            <div className="row container mt-2">
                <div className="col-md-6">
                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                        className="card-img-top" alt={product.name} height="400px" width="150px" />


                </div>
                <div className="col-md-6 " >

                    <h1 className="text-center">Product Details</h1>
                    <h4>Name : {product.name}</h4>
                    <h4>Description : {product.description}</h4>
                    <h4>Price : रु{product.price}</h4>
                    <h4>Category : {product?.category?.name}</h4>
                    <h4>Subcategory : {product?.subcategory?.name}</h4>

                    <button className="btn btn-secondary ms-1">ADD TO CART</button>
                </div>

                <div className="row">\
                    similar products
                </div>

            </div>
        </Layout >
    )
}

export default ProductDetails

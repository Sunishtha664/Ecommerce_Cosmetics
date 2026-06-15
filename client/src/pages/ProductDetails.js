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
            <h1>Product Details</h1>
            {JSON.stringify(product, null, 4)}
        </Layout>
    )
}

export default ProductDetails

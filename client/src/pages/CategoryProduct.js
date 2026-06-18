import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CategoryProduct = () => {
    const [products, setProducts] = useState([]);
    const params = useParams();
    const [category, setCategory] = useState([]);

    useEffect(() => {
        if (params?.slug) getProductsByCategory();

    }, [params?.slug])

    const getProductsByCategory = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (params?.slug) getProductsByCategory();
    }, [params?.slug])

    return (
        <Layout>
            <div className="container mt-3">
                <h1 className="text-center">{category?.name}</h1>
                <h4 className="text-center">{products?.length} result found</h4>
            </div>
        </Layout>
    )
}

export default CategoryProduct

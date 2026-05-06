import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Select } from 'antd'

const { Option } = Select

const CreateProduct = () => {
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [quantity, setQuantity] = useState('')
    const [shipping, setShipping] = useState('')
    const [photo, setPhoto] = useState('')

    //get all categories
    const getAllCategories = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category')
            if (data?.success) {
                setCategories(data?.category)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error fetching categories')
        }
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    //get all sub categories
    const getAllSubcategories = async () => {
        try {
            const { data } = await axios.get('/api/v1/subcategory/get-subcategory')
            if (data?.success) {
                setSubcategories(data?.subcategory)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error fetching subcategories')
        }
    }

    useEffect(() => {
        getAllSubcategories()
    }, [])

    return (
        <Layout title="Dashboard-Create Product">
            <div className="container-fluid" m-3 p-3>
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Create Product</h1>
                        <div className="m-1 w-75">

                            <Select bordered={false} placeholder="Select a category" size="large" showSearch className='form-select mb-3'
                                onChange={(value) => {
                                    setCategory(value)
                                }}
                            >
                                {categories?.map((c) => (
                                    <Option key={c._id} value={c._id}>{c.name}</Option>
                                ))}
                            </Select>
                            <Select bordered={false} placeholder="Select a subcategory" size="large" showSearch className='form-select mb-3'
                                onChange={(value) => {
                                    setSubcategory(value)
                                }}
                            >
                                {subcategories?.map((s) => (
                                    <Option key={s._id} value={s._id}>{s.name}</Option>
                                ))}
                            </Select>

                            <div className="mb-3">
                                <label htmlFor="upload images" className="btn btn-outline-secondary col-md-12">

                                    {photo ? photo.name : "Upload Product Image"}
                                    <input type="file" name="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct

import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateProduct = () => {
    const navigate = useNavigate()
    const API = process.env.REACT_APP_API || ''
    const getAuthConfig = () => {
        const authData = localStorage.getItem('auth')
        const token = authData ? JSON.parse(authData)?.token : ''
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    }
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [quantity, setQuantity] = useState('')
    const [shipping, setShipping] = useState('')
    const [photo, setPhoto] = useState('')

    //get all categories
    const getAllCategories = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/category/get-category`)
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

    //get subcategories by category
    const getSubcategoriesByCategory = async (categoryId) => {
        try {
            const { data } = await axios.get(`${API}/api/v1/subcategory/get-subcategories/${categoryId}`)
            if (data?.success) {
                setSubcategories(data?.subcategories)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error fetching subcategories')
        }
    }

    //handle category change
    const handleCategoryChange = (value) => {
        setCategory(value)
        setSubcategory('') // clear subcategory when category changes
        if (value) {
            getSubcategoriesByCategory(value)
        } else {
            setSubcategories([])
        }
    }

    //create product function
    const handleCreate = async (e) => {
        e.preventDefault()

        if (!name || !description || !brand || !price || !quantity || !category || shipping === '' || !photo) {
            return toast.error('Please fill in all required fields and upload a product image')
        }

        if (subcategories.length > 0 && !subcategory) {
            return toast.error('Please select a subcategory for the chosen category')
        }

        try {
            const productData = new FormData()
            productData.append('name', name)
            productData.append('description', description)
            productData.append('brand', brand)
            productData.append('price', Number(price))
            productData.append('quantity', Number(quantity))
            productData.append('shipping', shipping === '1')
            productData.append('category', category)
            if (subcategory) productData.append('subcategory', subcategory)
            productData.append('photo', photo)

            const { data } = await axios.post(`${API}/api/v1/product/create-product`, productData, getAuthConfig())
            console.log('Create product response', data)
            if (data?.success) {
                toast.success('Product created successfully')
                navigate('/dashboard/admin/products')
            } else {
                toast.error(data?.message || 'Error creating product')
            }
        } catch (error) {
            console.error('Create product error', error?.response || error)
            toast.error(error.response?.data?.message || error.response?.data?.error || error.message || 'Error creating product')
        }
    }


    return (
        <Layout title="Dashboard - Create Product">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3 mb-4">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title mb-3">Create Product</h2>
                                <form onSubmit={handleCreate} className="p-3 w-75">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Category</label>
                                        <select
                                            className="form-select"
                                            value={category}
                                            onChange={(e) => handleCategoryChange(e.target.value)}
                                        >
                                            <option value="">Select category</option>
                                            {categories?.map((c) => (
                                                <option key={c._id} value={c._id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Subcategory</label>
                                        <select
                                            className="form-select"
                                            value={subcategory}
                                            onChange={(e) => setSubcategory(e.target.value)}
                                            disabled={!category || subcategories.length === 0}
                                        >
                                            <option value="">Select subcategory</option>
                                            {subcategories?.map((s) => (
                                                <option key={s._id} value={s._id}>{s.name}</option>
                                            ))}
                                        </select>
                                        <small className="form-text text-muted">
                                            {!category ? 'Select a category first to see subcategories.' : subcategories.length ? 'Choose the matching subcategory.' : 'No subcategories exist for this category.'}
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Product Image</label>
                                        <label className="btn btn-outline-secondary col-md-12">
                                            {photo ? photo.name : 'Upload Product Image'}
                                            <input type="file" name="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                        </label>
                                    </div>
                                    <div className="mb-3">
                                        {photo && (
                                            <div className="text-center">
                                                <img
                                                    src={URL.createObjectURL(photo)}
                                                    alt="Product"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '220px' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Name</label>
                                        <input type="text" value={name} placeholder="Write a name" className="form-control" onChange={(e) => setName(e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea required value={description} placeholder="Write a description" className="form-control" onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Brand</label>
                                        <input type="text" value={brand} placeholder="Write brand name" className="form-control" onChange={(e) => setBrand(e.target.value)} />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Price</label>
                                            <input required type="number" min="0" value={price} placeholder="Write price in numbers" className="form-control" onChange={(e) => setPrice(e.target.value)} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Quantity</label>
                                            <input required type="number" min="0" value={quantity} placeholder="Write quantity in numbers" className="form-control" onChange={(e) => setQuantity(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Shipping</label>
                                        <select
                                            className="form-select"
                                            value={shipping}
                                            onChange={(e) => setShipping(e.target.value)}
                                        >
                                            <option value="">Select Shipping</option>
                                            <option value="0">No</option>
                                            <option value="1">Yes</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <button type="submit" className="btn btn-primary">Create Product</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default CreateProduct

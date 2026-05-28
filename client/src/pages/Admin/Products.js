import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Products = () => {
    const [activeTab, setActiveTab] = useState('view')
    const [products, setProducts] = useState([])
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

    // Get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/get-products')
            if (data?.success) {
                setProducts(data.products)
            }
        }
        catch (error) {
            console.log(error)
            toast.error('Something went wrong while fetching products')
        }
    }

    // Get all categories
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

    // Get subcategories by category
    const getSubcategoriesByCategory = async (categoryId) => {
        try {
            const { data } = await axios.get(`/api/v1/subcategory/get-subcategories/${categoryId}`)
            if (data?.success) {
                setSubcategories(data?.subcategories)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error fetching subcategories')
        }
    }

    // Handle category change
    const handleCategoryChange = (value) => {
        setCategory(value)
        setSubcategory('')
        if (value) {
            getSubcategoriesByCategory(value)
        } else {
            setSubcategories([])
        }
    }

    // Create product function
    const handleCreate = async (e) => {
        e.preventDefault()

        // Validation
        if (!name || !description || !price || !quantity || !category || shipping === '') {
            toast.error('Please fill in all required fields (Name, Description, Price, Quantity, Category, Shipping)')
            return
        }

        if (!photo) {
            toast.error('Please upload a product image')
            return
        }

        if (subcategories.length > 0 && !subcategory) {
            toast.error('Please select a subcategory for the chosen category')
            return
        }

        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('description', description.trim())
            formData.append('price', parseFloat(price))
            formData.append('quantity', parseInt(quantity))
            formData.append('shipping', shipping === '1' ? true : false)
            formData.append('category', category)
            if (subcategory) {
                formData.append('subcategory', subcategory)
            }
            formData.append('photo', photo)

            const { data } = await axios.post('/api/v1/product/create-product', formData)

            if (data?.success) {
                toast.success('Product created successfully!')
                // Reset form
                resetForm()
                // Refresh products list
                await getAllProducts()
                // Switch to view tab
                setActiveTab('view')
            } else {
                toast.error(data?.message || 'Failed to create product')
            }
        } catch (error) {
            console.error('Create product error:', error)
            const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Error creating product'
            toast.error(errorMsg)
        }
    }

    const resetForm = () => {
        setName('')
        setDescription('')
        setPrice('')
        setCategory('')
        setSubcategory('')
        setQuantity('')
        setShipping('')
        setPhoto('')
    }

    // Lifecycle method
    useEffect(() => {
        getAllProducts()
        getAllCategories()
    }, [])

    return (
        <Layout title="Dashboard - Products">
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <div className="card shadow-sm">
                        <div className="card-header bg-light p-3 border-bottom">
                            <ul className="nav nav-tabs card-header-tabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'view' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('view')}
                                        style={{
                                            cursor: 'pointer',
                                            fontWeight: activeTab === 'view' ? '600' : '500',
                                            color: activeTab === 'view' ? '#0d6efd' : '#666',
                                            borderBottom: activeTab === 'view' ? '3px solid #0d6efd' : 'none'
                                        }}
                                    >
                                        All Products
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('create')}
                                        style={{
                                            cursor: 'pointer',
                                            fontWeight: activeTab === 'create' ? '600' : '500',
                                            color: activeTab === 'create' ? '#0d6efd' : '#666',
                                            borderBottom: activeTab === 'create' ? '3px solid #0d6efd' : 'none'
                                        }}
                                    >
                                        Create Product
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="card-body">
                            {/* View Products Tab */}
                            {activeTab === 'view' && (
                                <div>
                                    <h1 className='mb-4' style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>All Products</h1>
                                    {products && products.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover table-striped">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products.map((product) => (
                                                        <tr key={product._id}>
                                                            <td>{product._id.substring(0, 8)}</td>
                                                            <td>{product.name}</td>
                                                            <td>₹{product.price}</td>
                                                            <td>{product.quantity}</td>
                                                            <td>
                                                                <button className="btn btn-sm btn-warning me-2">Edit</button>
                                                                <button className="btn btn-sm btn-danger">Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="alert alert-info text-center">
                                            <p>No products found. <button className="btn btn-link" onClick={() => setActiveTab('create')}>Create one now</button></p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Create Product Tab */}
                            {activeTab === 'create' && (
                                <div>
                                    <h2 className='mb-4' style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>Create Product</h2>
                                    <form onSubmit={handleCreate} className="p-3">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Category *</label>
                                                    <select
                                                        className="form-select"
                                                        value={category}
                                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                                        required
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
                                                    <small className="text-muted d-block mt-1">
                                                        {!category ? 'Select a category first to see subcategories.' : subcategories.length ? 'Choose the matching subcategory.' : 'No subcategories exist for this category.'}
                                                    </small>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Product Name *</label>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        placeholder="Enter product name"
                                                        className="form-control"
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Description *</label>
                                                    <textarea
                                                        value={description}
                                                        placeholder="Enter product description"
                                                        className="form-control"
                                                        rows="4"
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label fw-bold">Price *</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={price}
                                                            placeholder="Enter price"
                                                            className="form-control"
                                                            onChange={(e) => setPrice(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label fw-bold">Quantity *</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={quantity}
                                                            placeholder="Enter quantity"
                                                            className="form-control"
                                                            onChange={(e) => setQuantity(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label fw-bold">Shipping *</label>
                                                        <select
                                                            className="form-select"
                                                            value={shipping}
                                                            onChange={(e) => setShipping(e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Shipping</option>
                                                            <option value="0">No</option>
                                                            <option value="1">Yes</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2 mt-4">
                                                    <button type="submit" className="btn btn-primary btn-lg">
                                                        <i className="fa fa-save me-2"></i>Create Product
                                                    </button>
                                                    <button type="button" className="btn btn-secondary btn-lg" onClick={() => {
                                                        setName('')
                                                        setDescription('')
                                                        setPrice('')
                                                        setCategory('')
                                                        setSubcategory('')
                                                        setQuantity('')
                                                        setShipping('')
                                                        setPhoto('')
                                                    }}>
                                                        Clear Form
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="card bg-light p-3">
                                                    <h5 className="card-title fw-bold mb-3">Product Image</h5>
                                                    <label className="btn btn-outline-primary col-12 mb-3" style={{ cursor: 'pointer' }}>
                                                        {photo ? photo.name : "Choose Image"}
                                                        <input type="file" name="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                                    </label>
                                                    {photo && (
                                                        <div className="text-center">
                                                            <img
                                                                src={URL.createObjectURL(photo)}
                                                                alt="Product Preview"
                                                                style={{ maxWidth: '100%', height: 'auto', maxHeight: '250px', borderRadius: '8px' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products

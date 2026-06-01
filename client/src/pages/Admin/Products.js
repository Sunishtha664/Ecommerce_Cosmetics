import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Modal } from 'antd'

const Products = () => {
    const API = process.env.REACT_APP_API || ''
    const [products, setProducts] = useState([])
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [quantity, setQuantity] = useState('')
    const [shipping, setShipping] = useState('')
    const [photo, setPhoto] = useState(null)
    const [photoPreview, setPhotoPreview] = useState('')
    const [visible, setVisible] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const getAllProducts = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/get-products')
            if (data?.success) {
                setProducts(data.products)
            }
        }
        catch (error) {
            console.error(error)
            toast.error('Something went wrong while fetching products')
        }
    }

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

    const handleCategoryChange = (value) => {
        setCategory(value)
        setSubcategory('')
        if (value) {
            getSubcategoriesByCategory(value)
        } else {
            setSubcategories([])
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
        setPhoto(null)
        setPhotoPreview('')
        setSelectedProduct(null)
    }

    const handleEdit = (product) => {
        setSelectedProduct(product)
        setName(product.name || '')
        setDescription(product.description || '')
        setPrice(product.price || '')
        setCategory(product.category?._id || '')
        setSubcategory(product.subcategory?._id || '')
        setQuantity(product.quantity || '')
        setShipping(product.shipping ? '1' : '0')
        setPhoto(null)
        setPhotoPreview(`${API}/api/v1/product/product-photo/${product._id}?${Date.now()}`)

        if (product.category?._id) {
            getSubcategoriesByCategory(product.category._id)
        }
        setVisible(true)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        if (!selectedProduct) return

        if (!name || !description || !price || !quantity || !category || shipping === '') {
            toast.error('Please fill in all required fields (Name, Description, Price, Quantity, Category, Shipping)')
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
            if (photo) {
                formData.append('photo', photo)
            }

            const { data } = await axios.put(`/api/v1/product/update-product/${selectedProduct._id}`, formData)
            if (data?.success) {
                toast.success('Product updated successfully!')
                setVisible(false)
                resetForm()
                await getAllProducts()
            } else {
                toast.error(data?.message || 'Failed to update product')
            }
        } catch (error) {
            console.error('Update product error:', error)
            const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Error updating product'
            toast.error(errorMsg)
        }
    }

    const handleDelete = async (id, name) => {
        const confirmed = window.confirm(`Delete product "${name}" permanently?`)
        if (!confirmed) return

        try {
            const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`)
            if (data?.success) {
                toast.success(`${name} deleted successfully`)
                getAllProducts()
            } else {
                toast.error('Failed to delete product')
            }
        } catch (error) {
            console.error('Delete product error:', error)
            toast.error(error?.response?.data?.message || 'Error deleting product')
        }
    }

    const closeModal = () => {
        setVisible(false)
        resetForm()
    }

    useEffect(() => {
        getAllProducts()
        getAllCategories()
    }, [])

    return (
        <Layout title="Dashboard - Products">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3 mb-4">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="card-title mb-0">All Products</h2>
                                    <button className="btn btn-primary" onClick={() => navigate('/dashboard/admin/create-product')}>
                                        Create Product
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">Product</th>
                                                <th scope="col">Category</th>
                                                <th scope="col">Subcategory</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Qty</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products?.length ? (
                                                products.map((product) => (
                                                    <tr key={product._id}>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <img
                                                                    src={`${API}/api/v1/product/product-photo/${product._id}?${Date.now()}`}
                                                                    alt={product.name}
                                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60?text=No+Image' }}
                                                                />
                                                                <div>
                                                                    <strong>{product.name}</strong>
                                                                    <div className="text-muted small">
                                                                        {product.description?.substring(0, 50)}{product.description?.length > 50 ? '...' : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{product.category?.name || '—'}</td>
                                                        <td>{product.subcategory?.name || '—'}</td>
                                                        <td>₹{product.price}</td>
                                                        <td>{product.quantity}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(product)}>
                                                                Edit
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product._id, product.name)}>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4 text-muted">
                                                        No products found yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal open={visible} onCancel={closeModal} footer={null} title="Edit Product">
                    <form onSubmit={handleUpdate}>
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
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Product Name *</label>
                            <input
                                type="text"
                                value={name}
                                className="form-control"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Description *</label>
                            <textarea
                                value={description}
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
                                    className="form-control"
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
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

                        <div className="mb-3">
                            <label className="form-label fw-bold">Product Image</label>
                            <label className="btn btn-outline-primary col-12 mb-3" style={{ cursor: 'pointer' }}>
                                {photo ? photo.name : 'Choose New Image'}
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0]
                                        setPhoto(file)
                                        if (file) {
                                            setPhotoPreview(URL.createObjectURL(file))
                                        }
                                    }}
                                    hidden
                                />
                            </label>
                            {photoPreview && (
                                <img
                                    src={photoPreview}
                                    alt="Product preview"
                                    className="img-fluid rounded"
                                />
                            )}
                        </div>

                        <div className="d-flex gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    )
}

export default Products

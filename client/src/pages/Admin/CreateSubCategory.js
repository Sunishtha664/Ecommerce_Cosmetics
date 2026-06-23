import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-toastify'
import axios from 'axios'
import SubcategoryForm from '../../components/Form/SubcategoryForm'
import { Modal } from 'antd'

const CreateSubCategory = () => {
    const API = process.env.REACT_APP_API || ''
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)
    const [updatedName, setUpdatedName] = useState('')
    const [updatedParentCategory, setUpdatedParentCategory] = useState('')

    const getAuthConfig = () => {
        const authData = localStorage.getItem('auth')
        const token = authData ? JSON.parse(authData)?.token : ''
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    }

    const getAllCategories = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/category/get-category`)
            if (data.success) {
                setCategories(data.category)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error fetching categories')
        }
    }

    const getAllSubcategories = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/subcategory/get-subcategory`)
            if (data.success) {
                setSubcategories(data.subcategory)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error fetching subcategories')
        }
    }

    useEffect(() => {
        getAllCategories()
        getAllSubcategories()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(`${API}/api/v1/subcategory/create-subcategory`, {
                name,
                parentCategory
            }, getAuthConfig())
            if (data?.success) {
                toast.success(`${data.subcategory.name} created successfully`)
                setName('')
                setParentCategory('')
                getAllSubcategories()
            } else {
                toast.error('Failed to create subcategory')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to create subcategory')
        }
    }

    const handleEdit = (subcategory) => {
        setSelected(subcategory)
        setUpdatedName(subcategory.name)
        setUpdatedParentCategory(subcategory.parentCategory?._id || '')
        setVisible(true)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        if (!selected) return
        try {
            const { data } = await axios.put(`${API}/api/v1/subcategory/update-subcategory/${selected._id}`, {
                name: updatedName,
                parentCategory: updatedParentCategory
            }, getAuthConfig())
            if (data.success) {
                toast.success(`${updatedName} updated successfully`)
                setSelected(null)
                setUpdatedName('')
                setUpdatedParentCategory('')
                setVisible(false)
                getAllSubcategories()
            } else {
                toast.error('Failed to update subcategory')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to update subcategory')
        }
    }

    const handleDelete = async (id, name) => {
        try {
            const { data } = await axios.delete(`${API}/api/v1/subcategory/delete-subcategory/${id}`, getAuthConfig())
            if (data.success) {
                toast.success(`${name} deleted successfully`)
                getAllSubcategories()
            } else {
                toast.error('Failed to delete subcategory')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to delete subcategory')
        }
    }

    return (
        <Layout title="Dashboard - Create Subcategory">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3 mb-4">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title mb-3">Manage Subcategories</h2>
                                <div className="p-3 w-50">
                                    <SubcategoryForm
                                        handleSubmit={handleSubmit}
                                        name={name}
                                        setName={setName}
                                        parentCategory={parentCategory}
                                        setParentCategory={setParentCategory}
                                        categories={categories}
                                    />
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Parent Category</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subcategories?.length ? (
                                                subcategories.map((subcategory) => (
                                                    <tr key={subcategory._id}>
                                                        <td>{subcategory.name}</td>
                                                        <td>{subcategory.parentCategory?.name || '—'}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => handleEdit(subcategory)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(subcategory._id, subcategory.name)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center py-4 text-muted">
                                                        No subcategories found yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>
                            <SubcategoryForm
                                handleSubmit={handleUpdate}
                                name={updatedName}
                                setName={setUpdatedName}
                                parentCategory={updatedParentCategory}
                                setParentCategory={setUpdatedParentCategory}
                                categories={categories}
                            />
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateSubCategory

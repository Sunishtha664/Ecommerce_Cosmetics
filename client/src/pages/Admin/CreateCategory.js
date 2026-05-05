import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-toastify'
import axios from 'axios'
import CategoryForm from '../../components/Form/CategoryForm'

const CreateCategory = () => {
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('/api/v1/category/create-category', { name })
            if (data?.success) {
                toast.success(`${data.category.name} created successfully`)
                setName('')
                getAllCategories()
            }
            else {
                toast.error('Failed to create category')
            }
        }
        catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to create category')
        }
    }

    const getAllCategories = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category')
            if (data.success) {
                setCategories(data.category)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error fetching categories')
        }
    }

    const handleCreateCategory = async (e) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.warning('Please enter a category name')
            return
        }

        try {
            setLoading(true)
            const { data } = await axios.post('/api/v1/category/create-category', { name })
            if (data.success) {
                toast.success(`${data.category.name} created successfully`)
                setName('')
                getAllCategories()
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to create category')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    return (
        <Layout title="Dashboard - Create Category">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3 mb-4">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title mb-3">Manage Categories</h2>
                                <div className="p-3 w-50">
                                    <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />

                                </div>


                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories?.length ? (
                                                categories.map((category) => (
                                                    <tr key={category._id}>
                                                        <td>{category.name}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-primary me-2" disabled>
                                                                Edit
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger" disabled>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="text-center py-4 text-muted">
                                                        No categories found yet.
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
            </div>
        </Layout>
    )
}

export default CreateCategory

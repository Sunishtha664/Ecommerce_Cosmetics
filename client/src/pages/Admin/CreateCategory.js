import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-toastify'
import axios from 'axios'
import CategoryForm from '../../components/Form/CategoryForm'
import { Modal } from 'antd'

const CreateCategory = () => {
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)
    const [updatedName, setUpdatedName] = useState('')

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

    useEffect(() => {
        getAllCategories()
    }, [])

    const handleEdit = (category) => {
        setSelected(category)
        setUpdatedName(category.name)
        setVisible(true)
    }

    //update category
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`/api/v1/category/update-category/${selected?._id}`, { name: updatedName })
            if (data.success) {
                toast.success(`${updatedName} updated successfully`)
                setSelected(null)
                setUpdatedName('')
                setVisible(false)
                getAllCategories()
            }
            else {
                toast.error('Failed to update category')
            }
        }
        catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to update category')
        }
    }

    //delete category
    const handleDelete = async (id, name) => {
        try {
            const { data } = await axios.delete(`/api/v1/category/delete-category/${id}`)
            if (data.success) {
                toast.success(`${name} deleted successfully`)
                getAllCategories()
            }
            else {
                toast.error('Failed to delete category')
            }
        }
        catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to delete category')
        }
    }


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
                                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(category)}>
                                                                Edit
                                                            </button>
                                                            <button className="btn btn
                                                            -sm btn-outline-danger" onClick={() => handleDelete(category._id, category.name)}>
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
                        <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>

                            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                        </Modal>
                    </div>
                </div>
            </div >
        </Layout >
    )
}

export default CreateCategory

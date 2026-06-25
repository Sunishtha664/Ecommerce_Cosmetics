import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-toastify'
import axios from 'axios'
import SectionForm from '../../components/Form/SectionForm'
import { Modal } from 'antd'

const CreateSection = () => {
    const API = process.env.REACT_APP_API || ''
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [parentSubcategory, setParentSubcategory] = useState('')
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [sections, setSections] = useState([])
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)
    const [updatedName, setUpdatedName] = useState('')
    const [updatedCategory, setUpdatedCategory] = useState('')
    const [updatedParentSubcategory, setUpdatedParentSubcategory] = useState('')

    const getAuthConfig = () => {
        const authData = localStorage.getItem('auth')
        const token = authData ? JSON.parse(authData)?.token : ''
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    }

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

    const getAllSubcategories = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/subcategory/get-subcategory`)
            if (data?.success) {
                setSubcategories(data?.subcategory)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error fetching subcategories')
        }
    }

    const getAllSections = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/section/get-section`)
            if (data?.success) {
                setSections(data?.section)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error fetching sections')
        }
    }

    useEffect(() => {
        getAllCategories()
        getAllSubcategories()
        getAllSections()
    }, [])

    const getSubcategoriesByCategory = async (categoryId) => {
        if (!categoryId) {
            setSubcategories([])
            return
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(`${API}/api/v1/section/create-section`, {
                name,
                parentSubcategory
            }, getAuthConfig())
            if (data?.success) {
                toast.success(`${name} created successfully`)
                setName('')
                setCategory('')
                setParentSubcategory('')
                getAllSections()
            } else {
                toast.error(data?.message || 'Failed to create section')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to create section')
        }
    }

    const handleEdit = (section) => {
        setSelected(section)
        setUpdatedName(section.name)
        setUpdatedCategory(section.parentSubcategory?.parentCategory?._id || '')
        setUpdatedParentSubcategory(section.parentSubcategory?._id || '')
        setVisible(true)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        if (!selected) return
        try {
            const { data } = await axios.put(`${API}/api/v1/section/update-section/${selected._id}`, {
                name: updatedName,
                parentSubcategory: updatedParentSubcategory
            }, getAuthConfig())
            if (data?.success) {
                toast.success(`${updatedName} updated successfully`)
                setSelected(null)
                setUpdatedName('')
                setUpdatedCategory('')
                setUpdatedParentSubcategory('')
                setVisible(false)
                getAllSections()
            } else {
                toast.error(data?.message || 'Failed to update section')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to update section')
        }
    }

    const handleDelete = async (id, name) => {
        try {
            const { data } = await axios.delete(`${API}/api/v1/section/delete-section/${id}`, getAuthConfig())
            if (data?.success) {
                toast.success(`${name} deleted successfully`)
                getAllSections()
            } else {
                toast.error(data?.message || 'Failed to delete section')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to delete section')
        }
    }

    const handleCategoryChange = async (categoryId) => {
        setCategory(categoryId)
        setParentSubcategory('')
        await getSubcategoriesByCategory(categoryId)
    }

    return (
        <Layout title="Dashboard - Create Section">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3 mb-4">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title mb-3">Manage Sections</h2>
                                <div className="p-3 w-50">
                                    <SectionForm
                                        handleSubmit={handleSubmit}
                                        name={name}
                                        setName={setName}
                                        category={category}
                                        setCategory={handleCategoryChange}
                                        parentSubcategory={parentSubcategory}
                                        setParentSubcategory={setParentSubcategory}
                                        categories={categories}
                                        subcategories={subcategories}
                                    />
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Parent Subcategory</th>
                                                <th scope="col">Category</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sections?.length ? (
                                                sections.map((section) => (
                                                    <tr key={section._id}>
                                                        <td>{section.name}</td>
                                                        <td>{section.parentSubcategory?.name || '—'}</td>
                                                        <td>{section.parentSubcategory?.parentCategory?.name || '—'}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(section)}>
                                                                Edit
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(section._id, section.name)}>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-4 text-muted">
                                                        No sections found yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>
                            <SectionForm
                                handleSubmit={handleUpdate}
                                name={updatedName}
                                setName={setUpdatedName}
                                category={updatedCategory}
                                setCategory={async (value) => {
                                    setUpdatedCategory(value)
                                    const { data } = await axios.get(`${API}/api/v1/subcategory/get-subcategories/${value}`)
                                    if (data?.success) {
                                        setSubcategories(data.subcategories)
                                    }
                                }}
                                parentSubcategory={updatedParentSubcategory}
                                setParentSubcategory={setUpdatedParentSubcategory}
                                categories={categories}
                                subcategories={subcategories}
                            />
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateSection
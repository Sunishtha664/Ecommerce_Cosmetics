import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../user/Dashboard.css'

const UserProfile = () => {
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        // Check if user is authenticated
        const authData = localStorage.getItem('auth')
        const parsedAuth = authData ? JSON.parse(authData) : null

        if (!parsedAuth?.token || !parsedAuth?.user) {
            navigate('/login', { state: '/dashboard/user/profile' })
        } else {
            setLoading(false)
            // Initialize form data with user info
            setFormData({
                name: parsedAuth.user.name,
                email: parsedAuth.user.email,
                phone: parsedAuth.user.phone,
                address: parsedAuth.user.address
            })
        }
    }, [navigate])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        try {
            setErrorMessage('')
            setSuccessMessage('')

            const { data } = await axios.put('/api/v1/auth/update-profile', formData, {
                headers: {
                    Authorization: auth?.token
                }
            })

            if (data?.success) {
                // Update auth context with new user data
                const updatedAuth = {
                    ...auth,
                    user: {
                        ...auth.user,
                        ...data.user
                    }
                }
                setAuth(updatedAuth)
                localStorage.setItem('auth', JSON.stringify(updatedAuth))

                setSuccessMessage('Profile updated successfully!')
                setEditing(false)

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000)
            } else {
                setErrorMessage(data?.message || 'Failed to update profile')
            }
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || 'Error updating profile')
        }
    }

    const handleCancel = () => {
        setEditing(false)
        // Reset form to current user data
        setFormData({
            name: auth?.user?.name,
            email: auth?.user?.email,
            phone: auth?.user?.phone,
            address: auth?.user?.address
        })
    }

    if (loading) {
        return null // or a loading spinner
    }

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase() || 'U'
    }

    return (
        <Layout title="User Profile">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        {/* Success Message */}
                        {successMessage && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {successMessage}
                                <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                            </div>
                        )}

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {errorMessage}
                                <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
                            </div>
                        )}

                        <div className="card profile-card">
                            <div className="card-header bg-primary text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="mb-0">My Profile</h3>
                                    {!editing && (
                                        <button
                                            className="btn btn-light btn-sm"
                                            onClick={() => setEditing(true)}
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="card-body">
                                {!editing ? (
                                    // View Mode
                                    <div className="profile-view">
                                        <div className="row mb-4">
                                            <div className="col-md-3 text-center">
                                                <div className="avatar-large mb-3">
                                                    {getInitials(auth?.user?.name)}
                                                </div>
                                                <p className="text-muted">
                                                    {auth?.user?.role === 0 ? 'Customer' : 'Administrator'}
                                                </p>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <label className="fw-bold text-secondary small">Full Name</label>
                                                        <p className="fs-5 mb-0">{auth?.user?.name}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="fw-bold text-secondary small">Email Address</label>
                                                        <p className="fs-5 mb-0">{auth?.user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <label className="fw-bold text-secondary small">Phone Number</label>
                                                        <p className="fs-5 mb-0">{auth?.user?.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label className="fw-bold text-secondary small">Delivery Address</label>
                                                        <p className="fs-5 mb-0">{auth?.user?.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Edit Mode
                                    <form onSubmit={handleUpdateProfile}>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="name" className="form-label fw-bold">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="email" className="form-label fw-bold">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-lg"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="phone" className="form-label fw-bold">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    className="form-control form-control-lg"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="row mb-4">
                                            <div className="col-md-12">
                                                <label htmlFor="address" className="form-label fw-bold">Delivery Address</label>
                                                <textarea
                                                    className="form-control form-control-lg"
                                                    id="address"
                                                    name="address"
                                                    rows="3"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-lg me-2"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-lg"
                                                    onClick={handleCancel}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UserProfile

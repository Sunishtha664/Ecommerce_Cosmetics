import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
import UserMenu from '../../components/Layout/UserMenu'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
    const [auth] = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is authenticated
        const authData = localStorage.getItem('auth')
        const parsedAuth = authData ? JSON.parse(authData) : null

        if (!parsedAuth?.token || !parsedAuth?.user) {
            navigate('/login', { state: '/dashboard/user' })
        } else {
            setLoading(false)
        }
    }, [navigate])

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
        <Layout title="User Dashboard">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        {/* Welcome Card */}
                        <div className="card welcome-card mb-4 shadow-sm">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-md-2 text-center">
                                        <div className="avatar-large">
                                            {getInitials(auth?.user?.name)}
                                        </div>
                                    </div>
                                    <div className="col-md-10">
                                        <h2 className="mb-1">Welcome, {auth?.user?.name}! 👋</h2>
                                        <p className="text-muted mb-0">Here's your dashboard overview</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <Link to="/dashboard/user/profile" className="text-decoration-none">
                                    <div className="stat-card stat-card-hover h-100">
                                        <div className="stat-icon profile-icon">
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <div className="stat-content">
                                            <h5>My Profile</h5>
                                            <p className="text-muted">View & edit your information</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-6">
                                <Link to="/dashboard/user/orders" className="text-decoration-none">
                                    <div className="stat-card stat-card-hover h-100">
                                        <div className="stat-icon orders-icon">
                                            <i className="fas fa-shopping-bag"></i>
                                        </div>
                                        <div className="stat-content">
                                            <h5>My Orders</h5>
                                            <p className="text-muted">Track your orders</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* User Info Summary */}
                        <div className="card shadow-sm">
                            <div className="card-header bg-light border-bottom">
                                <h5 className="mb-0">Account Information</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-bold text-secondary small">Email Address</label>
                                        <p className="fs-5 mb-0">{auth?.user?.email}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-bold text-secondary small">Phone Number</label>
                                        <p className="fs-5 mb-0">{auth?.user?.phone}</p>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="fw-bold text-secondary small">Delivery Address</label>
                                        <p className="fs-5 mb-0">{auth?.user?.address}</p>
                                    </div>
                                </div>
                                <Link to="/dashboard/user/profile" className="btn btn-primary btn-sm">
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard

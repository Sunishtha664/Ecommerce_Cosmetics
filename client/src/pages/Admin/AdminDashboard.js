import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
import AdminMenu from '../../components/Layout/AdminMenu'

const AdminDashboard = () => {
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is authenticated and is admin
        const authData = localStorage.getItem('auth')
        const parsedAuth = authData ? JSON.parse(authData) : null

        if (!parsedAuth?.token || !parsedAuth?.user) {
            navigate('/login', { state: '/dashboard/admin' })
        } else if (parsedAuth?.user?.role !== 1) {
            navigate('/')
        } else {
            setLoading(false)
        }
    }, [navigate])

    if (loading) {
        return null // or a loading spinner
    }

    return (
        <Layout>
            <div className="container-fluid" m-3 p-3>
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <div className="card w-75 p-3">
                            <h3>{`Welcome to Admin Dashboard, ${auth?.user?.name || 'Admin'}!`} </h3>
                            <h3>Admin Name: {auth?.user?.name || 'Admin'}</h3>
                            <h3>Admin Email: {auth?.user?.email || 'N/A'}</h3>
                            <h3>Admin Contact: {auth?.user?.phone || 'N/A'}</h3>

                        </div>
                    </div>

                </div>

            </div>


        </Layout >
    )
}

export default AdminDashboard

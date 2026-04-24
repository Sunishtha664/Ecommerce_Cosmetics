import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'

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
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-9">content</div>

                </div>

            </div>


        </Layout >
    )
}

export default AdminDashboard

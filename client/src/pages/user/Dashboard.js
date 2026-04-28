import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
import UserMenu from '../../components/Layout/UserMenu'

const Dashboard = () => {
    const [auth, setAuth] = useAuth()
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

    return (
        <Layout title="User Dashboard">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card w-75 p-3">
                            <h3>{`Welcome to your Dashboard, ${auth?.user?.name || 'User'}!`} </h3>
                            <h3>Name: {auth?.user?.name || 'N/A'}</h3>
                            <h3>Email: {auth?.user?.email || 'N/A'}</h3>
                            <h3>Address: {auth?.user?.address || 'N/A'}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard

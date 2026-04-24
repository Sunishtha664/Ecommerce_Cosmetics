import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'

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
            <h1>User Dashboard</h1>
        </Layout>
    )
}

export default Dashboard

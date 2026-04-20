import React from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth';

const HomePage = () => {
    const [auth, setAuth] = useAuth();
    return (
        <Layout title="Luminelle - Your Beauty Destination">
            <h1>HomePage comp</h1>
            <pre>{JSON.stringify(auth, null, 4)}</pre>
        </Layout >
    )
}

export default HomePage

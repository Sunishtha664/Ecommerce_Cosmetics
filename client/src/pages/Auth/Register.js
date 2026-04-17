import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/auth/register`,
                { name, email, password, phone, address }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <Layout title="Register Page">
            <div className="register">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />

                    <button type="submit">Register</button>
                </form>
            </div>
        </Layout>
    );
};

export default Register;
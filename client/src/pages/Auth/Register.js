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
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("API:", process.env.REACT_APP_API);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/auth/register`,
                { name, email, password, phone, address, answer }

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
            <div className="register-container">
                <div className="register-wrapper">
                    <div className="register-header">
                        <h1 className="register-title">Create Account</h1>
                        <p className="register-subtitle">Join our community and start shopping</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Your Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                                id="phone"
                                type="text"
                                placeholder="+977 9800000000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                                id="address"
                                type="text"
                                placeholder="Your Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="answer" className="form-label">Create your secret code</label>
                            <input
                                id="answer"
                                type="text"
                                placeholder="Your Secret Code"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <button type="submit" className="submit-btn">Create Account</button>
                    </form>

                    <div className="register-footer">
                        <p>Already have an account? <a href="/login" className="login-link">Sign in</a></p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
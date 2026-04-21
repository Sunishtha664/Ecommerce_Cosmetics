
import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("API:", process.env.REACT_APP_API);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
                { email, newPassword, answer }
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
        };
        return (
            <Layout title="Forgot Password">
                <div className="login-container">
                    <div className="login-wrapper">
                        <div className="login-header">
                            <h1 className="login-title">Forgot Password?</h1>
                            <p className="login-subtitle">Enter your email to reset your password</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
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
                                <label htmlFor="answer" className="form-label">Enter your secret code</label>
                                <input
                                    id="answer"
                                    type="text"
                                    placeholder="Your secret code"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
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
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <button type="submit" className="submit-btn">Reset Password</button>


                        </form>

                        <div className="login-footer">
                            <p>Don't have an account? <a href="/register" className="register-link">Sign up</a></p>
                        </div>
                    </div>
                </div >
            </Layout >
        );
    };
}

export default ForgotPassword;

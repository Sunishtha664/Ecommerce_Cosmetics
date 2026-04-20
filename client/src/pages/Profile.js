import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import './Profile.css';

const Profile = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!auth?.user) {
            navigate('/login');
        }
    }, [auth, navigate]);

    if (!auth?.user) {
        return <Layout title="Profile" />;
    }

    const user = auth.user;

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <Layout title="User Profile">
            <div className="profile-container">
                <div className="profile-wrapper">
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="avatar-section">
                            <div className="avatar">
                                {getInitials(user.name)}
                            </div>
                        </div>
                        <div className="header-content">
                            <h1 className="profile-title">{user.name}</h1>
                            <p className="profile-subtitle">{user.role === 0 ? 'Customer' : 'Administrator'}</p>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="profile-content">
                        {/* Contact Information */}
                        <div className="info-section">
                            <h2 className="section-title">Contact Information</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Email Address</span>
                                    <p className="info-value">{user.email}</p>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Phone Number</span>
                                    <p className="info-value">{user.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="info-section">
                            <h2 className="section-title">Delivery Address</h2>
                            <div className="info-item full-width">
                                <p className="info-value address-text">{user.address}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-section">
                            <button
                                className="btn-primary"
                                onClick={() => navigate('/')}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;

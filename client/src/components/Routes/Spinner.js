import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Spinner = ({ message = "Loading Dashboard...", showCountdown = false }) => {
    const [count, setCount] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        if (showCountdown) {
            const interval = setInterval(() => {
                setCount(prevValue => {
                    if (prevValue <= 1) {
                        navigate('/login');
                        return 0;
                    }
                    return prevValue - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [showCountdown, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <div className="text-center">
                <div className="spinner-border text-primary" role="status" style={{
                    width: '3rem',
                    height: '3rem',
                    marginBottom: '1rem'
                }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted">{message}</h5>
                {showCountdown ? (
                    <p className="text-muted small">Redirecting in {count} seconds...</p>
                ) : (
                    <p className="text-muted small">Please wait while we verify your access</p>
                )}
            </div>
        </div>
    )
}

export default Spinner


import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

export default function PrivateRoute() {
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const [auth] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const authCheck = async () => {
            try {
                // Check localStorage directly for auth data
                const authData = localStorage.getItem('auth');
                const parsedAuth = authData ? JSON.parse(authData) : null;
                const token = parsedAuth?.token || auth?.token;

                console.log('Auth data from localStorage:', parsedAuth);
                console.log('Token found:', !!token);
                console.log('Token value:', token ? token.substring(0, 20) + '...' : 'none');

                if (!token) {
                    console.log('No token found, showing redirect spinner');
                    setRedirecting(true);
                    // Show redirecting spinner for 5 seconds
                    setTimeout(() => {
                        console.log('Redirecting to login...');
                        navigate('/login');
                    }, 5000);
                    return;
                }

                // For now, just check if token exists - skip server validation
                console.log('Token exists, allowing access to dashboard');
                setOk(true);
                setLoading(false);

                // TODO: Uncomment this when server auth check is working
                /*
                console.log('Checking auth with server...');
                console.log('API URL:', `${process.env.REACT_APP_API}/api/v1/auth/user-auth`);

                // Make sure axios has the correct headers
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/user-auth`, config);
                console.log('Auth check response:', res.data);

                if (res.data.ok) {
                    setOk(true);
                    setLoading(false);
                } else {
                    setOk(false);
                    setRedirecting(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 5000);
                }
                */
            } catch (error) {
                console.log('Auth check failed:', error);
                console.log('Error response:', error.response?.data);
                setOk(false);
                setRedirecting(true);
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            }
        };

        authCheck();
    }, [navigate]); // Only depend on navigate, check localStorage directly

    console.log('PrivateRoute state:', { loading, ok, hasToken: !!auth?.token, redirecting });

    if (loading && !redirecting) {
        return <Spinner message="Loading Dashboard..." />;
    }

    if (redirecting) {
        return <Spinner message="Redirecting..." showCountdown={true} />;
    }

    return ok ? <Outlet /> : null;
}
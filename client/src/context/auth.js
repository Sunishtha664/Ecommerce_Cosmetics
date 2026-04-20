import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    //default axios base URL and auth header
    axios.defaults.baseURL = process.env.REACT_APP_API || '';
    axios.defaults.headers.common['Authorization'] = auth?.token ? `Bearer ${auth.token}` : '';

    console.log('Auth context initialized with token:', !!auth?.token);
    useEffect(() => {
        const data = localStorage.getItem('auth');
        if (data) {
            const parsedData = JSON.parse(data);
            setAuth({
                user: parsedData.user,
                token: parsedData.token
            });
        }
    }, []); // Empty dependency array - only run on mount

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
}

//custom hook
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
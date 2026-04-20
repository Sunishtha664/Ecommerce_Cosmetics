import React, { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { GiShoppingBag } from "react-icons/gi";

const Header = () => {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link className="navbar-brand" to="/">
                            <GiShoppingBag /> Luminelle
                        </Link>

                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link " to="/" >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/category" href="#">
                                    Category
                                </NavLink>
                            </li>

                            {!user ? (
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/register" >
                                            Register
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/login">
                                            Login
                                        </NavLink>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item dropdown">
                                    <button
                                        className="nav-link btn btn-link dropdown-toggle"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {user.name}
                                    </button>
                                    {showDropdown && (
                                        <ul className="dropdown-menu show" style={{ display: 'block', position: 'absolute', right: '0', left: 'auto' }}>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/profile"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    View Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        handleLogout();
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            )}

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/cart" >
                                    Cart (0)
                                </NavLink>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>

        </>
    )
}

export default Header

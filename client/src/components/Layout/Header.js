import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GiShoppingBag } from "react-icons/gi";
import { useAuth } from '../../context/auth';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { Badge } from 'antd';

const Header = () => {
    const [auth, setAuth] = useAuth();
    const [cart] = useCart();
    const { categories } = useCategory();
    const [showDropdown, setShowDropdown] = useState(false);
    const [subcategoriesMap, setSubcategoriesMap] = useState({});
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({
            user: null,
            token: ""
        });
        localStorage.removeItem('auth');
        navigate('/login');

    };

    const loadSubcategories = async (categoryId) => {
        if (!categoryId || subcategoriesMap[categoryId]) return;
        try {
            const { data } = await axios.get(`/api/v1/subcategory/get-subcategories/${categoryId}`);
            if (data?.success) {
                setSubcategoriesMap(prev => ({
                    ...prev,
                    [categoryId]: data.subcategories || []
                }));
            }
        } catch (error) {
            console.error('Unable to load subcategories', error);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
                <div className="container-fluid">
                    <Link className="navbar-brand me-3" to="/">
                        <GiShoppingBag /> Luminelle
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* LEFT: Home and Categories */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item dropdown mega-menu">
                                <span className="nav-link dropdown-toggle" role="button" aria-expanded="false" style={{ cursor: 'pointer' }}>
                                    Categories
                                </span>

                                <div className="dropdown-menu mega-menu-content p-0">
                                    <div className="mega-menu-inner">
                                        <div className="mega-menu-top mb-3">
                                            <Link className="mega-menu-all" to="/categories">All Categories</Link>
                                        </div>
                                        <div className="mega-menu-grid">
                                            {categories?.map(c => (
                                                <div className="mega-menu-column" key={c._id} onMouseEnter={() => loadSubcategories(c._id)}>
                                                    <Link className="mega-menu-column-title" to={`/category/${c.slug}`}>
                                                        {c.name}
                                                    </Link>
                                                    <ul className="mega-menu-list">
                                                        {subcategoriesMap[c._id]?.length ? (
                                                            subcategoriesMap[c._id].map((sub) => (
                                                                <li key={sub._id}>
                                                                    <Link className="dropdown-item" to={`/subcategory/${sub.slug}`}>
                                                                        {sub.name}
                                                                    </Link>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li>
                                                                <span className="dropdown-item text-muted">No subcategories</span>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        {/* MIDDLE: Search Bar */}
                        <div className="nav-search mx-auto flex-grow-1" style={{ maxWidth: '400px' }}>
                            <SearchInput />
                        </div>

                        {/* RIGHT: User and Cart */}
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                            {!auth?.user ? (
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/register">
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
                                        {auth.user.name}
                                    </button>
                                    {showDropdown && (
                                        <ul className="dropdown-menu show" style={{ display: 'block', position: 'absolute', right: '0', left: 'auto' }}>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to={`/dashboard/${auth.user.role === 1 ? 'admin' : 'user'}`}
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    Dashboard
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
                                <Badge count={cart?.length || 0} showZero>
                                    <NavLink className="nav-link" to="/cart">
                                        Cart
                                    </NavLink>
                                </Badge>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Header

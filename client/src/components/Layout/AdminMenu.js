import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group">
                    <h4 className="mb-3 fw-bold" style={{ color: '#333' }}>Admin Panel</h4>
                    <NavLink
                        to="/dashboard/admin/create-category"
                        className="list-group-item list-group-item-action"
                        style={{
                            borderLeft: '3px solid transparent',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = '#0d6efd'}
                        onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}
                    >
                        <i className="fa fa-plus me-2"></i>Create Category
                    </NavLink>
                    <NavLink
                        to="/dashboard/admin/create-subcategory"
                        className="list-group-item list-group-item-action"
                        style={{
                            borderLeft: '3px solid transparent',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = '#0d6efd'}
                        onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}
                    >
                        <i className="fa fa-plus me-2"></i>Create Subcategory
                    </NavLink>
                    <NavLink
                        to="/dashboard/admin/create-section"
                        className="list-group-item list-group-item-action"
                        style={{
                            borderLeft: '3px solid transparent',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = '#0d6efd'}
                        onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}
                    >
                        <i className="fa fa-plus me-2"></i>Create Section
                    </NavLink>
                    <NavLink
                        to="/dashboard/admin/products"
                        className="list-group-item list-group-item-action"
                        style={{
                            borderLeft: '3px solid transparent',
                            transition: 'all 0.3s ease',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = '#0d6efd'}
                        onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}
                    >
                        <i className="fa fa-box me-2"></i>Products
                    </NavLink>
                    <NavLink
                        to="/dashboard/admin/users"
                        className="list-group-item list-group-item-action"
                        style={{
                            borderLeft: '3px solid transparent',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = '#0d6efd'}
                        onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}
                    >
                        <i className="fa fa-users me-2"></i>Users
                    </NavLink>
                    <NavLink
                        to="/dashboard/admin/orders"
                        className="list-group-item list-group-item-action"
                        style={{
                            borderLeft: '3px solid transparent',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = '#0d6efd'}
                        onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}
                    >
                        <i className="fa fa-shopping-cart me-2"></i>Orders
                    </NavLink>
                </div>
            </div>
        </>
    )
}

export default AdminMenu

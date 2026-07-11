import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GiShoppingBag } from 'react-icons/gi'
import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter an email address");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        toast.success("Thank you for subscribing to our newsletter! ✨");
        setEmail('');
    };

    return (
        <div className="footer">
            <div className="container">
                <div className="footer-grid w-100">
                    {/* Brand Section */}
                    <div className="footer-col">
                        <Link className="footer-logo" to="/">
                            <GiShoppingBag /> Luminelle
                        </Link>
                        <p className="mt-3">
                            Your ultimate destination for premium, cruelty-free, and dermatologically tested beauty essentials. Elevate your daily skincare and makeup ritual with Luminelle.
                        </p>
                        <div className="footer-social-icons">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                                <FaInstagram />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                                <FaFacebookF />
                            </a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                                <FaPinterestP />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h5>Shop & Explore</h5>
                        <ul className="footer-links mt-4">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/categories">Categories</Link></li>
                            <li><Link to="/search">Search Products</Link></li>
                            <li><Link to="/cart">My Cart</Link></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div className="footer-col">
                        <h5>Customer Care</h5>
                        <ul className="footer-links mt-4">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Support</Link></li>
                            <li><Link to="/policy">Privacy Policy</Link></li>
                            <li><Link to="/policy">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="footer-col">
                        <h5>Join Our Newsletter</h5>
                        <p className="mt-4">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="footer-newsletter-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit" className="footer-newsletter-btn">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom w-100">
                    <p>
                        All rights reserved &copy; 2026 Luminelle. Crafted for modern beauty.
                    </p>
                    <div className="footer-payment-icons">
                        <FaCcVisa className="payment-icon" title="Visa" />
                        <FaCcMastercard className="payment-icon" title="Mastercard" />
                        <FaCcPaypal className="payment-icon" title="Paypal" />
                        <FaCcApplePay className="payment-icon" title="Apple Pay" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer

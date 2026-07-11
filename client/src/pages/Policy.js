import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { FaShieldAlt, FaFileContract, FaTruck, FaLock } from "react-icons/fa";

const Policy = () => {
    const [activeTab, setActiveTab] = useState("privacy");

    const renderContent = () => {
        switch (activeTab) {
            case "privacy":
                return (
                    <div className="policy-content">
                        <h2 className="policy-content-title">Privacy Policy</h2>
                        <p className="policy-section-text">
                            At <strong>Luminelle</strong>, we prioritize the protection and confidentiality of your personal information. This Privacy Policy details how we collect, utilize, and safeguard your data when you visit our store or complete a purchase.
                        </p>
                        
                        <h3 className="policy-subheading">1. Information We Collect</h3>
                        <p className="policy-section-text">
                            We collect specific details required to fulfill your orders and enhance your shopping experience, including:
                        </p>
                        <ul className="policy-list">
                            <li>Personal identifiers: Name, email address, shipping address, and phone number.</li>
                            <li>Payment data: Billing details processed securely via certified payment providers.</li>
                            <li>Technical details: IP address, browser type, and cookies to improve website navigation and store responsiveness.</li>
                        </ul>

                        <h3 className="policy-subheading">2. How We Use Your Data</h3>
                        <p className="policy-section-text">
                            Your information is exclusively used to:
                        </p>
                        <ul className="policy-list">
                            <li>Process transactions and dispatch shipments.</li>
                            <li>Deliver customer care and resolve service tickets.</li>
                            <li>Distribute newsletters, exclusive deals, and product updates (you can opt-out at any time).</li>
                        </ul>

                        <h3 className="policy-subheading">3. Information Sharing & Security</h3>
                        <p className="policy-section-text">
                            Luminelle does not sell, trade, or distribute your private information to third parties. Data is shared only with trusted delivery partners to fulfill shipping. All data transfers are safeguarded with advanced SSL encryption.
                        </p>
                    </div>
                );
            case "terms":
                return (
                    <div className="policy-content">
                        <h2 className="policy-content-title">Terms of Service</h2>
                        <p className="policy-section-text">
                            Welcome to the Luminelle website. By accessing or using our website, you agree to comply with and be bound by the following Terms of Service. Please review them carefully.
                        </p>

                        <h3 className="policy-subheading">1. Online Store Terms</h3>
                        <p className="policy-section-text">
                            By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any unauthorized or illegal activity.
                        </p>

                        <h3 className="policy-subheading">2. Product Descriptions & Pricing</h3>
                        <p className="policy-section-text">
                            We strive to display our cosmetic colors and textures as accurately as possible. Prices for our products are subject to change without notice. We reserve the right to limit order quantities or refuse service to anyone at our discretion.
                        </p>

                        <h3 className="policy-subheading">3. Intellectual Property</h3>
                        <p className="policy-section-text">
                            All content on this site—including text, graphics, logos, images, and software—is the property of Luminelle and protected by international copyright laws. Any unauthorized reuse of this content is strictly prohibited.
                        </p>
                    </div>
                );
            case "shipping":
                return (
                    <div className="policy-content">
                        <h2 className="policy-content-title">Shipping & Returns</h2>
                        <p className="policy-section-text">
                            We want you to love your Luminelle products. Below is our policy regarding shipping timeframes, rates, and how to initiate a return or exchange.
                        </p>

                        <h3 className="policy-subheading">1. Shipping Options & Delivery Times</h3>
                        <p className="policy-section-text">
                            We ship orders daily from Monday through Friday.
                        </p>
                        <ul className="policy-list">
                            <li><strong>Standard Shipping:</strong> 3-5 business days (Free for orders over $50).</li>
                            <li><strong>Express Shipping:</strong> 1-2 business days (Flat rate of $15.00 applies).</li>
                        </ul>

                        <h3 className="policy-subheading">2. Return & Refund Policy</h3>
                        <p className="policy-section-text">
                            If you are not entirely satisfied with your cosmetic purchase, we accept returns on unused or gently tested items within 30 days of the delivery date.
                        </p>
                        <ul className="policy-list">
                            <li>Products must be returned in their original packaging.</li>
                            <li>To initiate a return, contact our support team at help@luminelle.com to obtain a pre-paid return slip.</li>
                            <li>Refunds will be processed to the original payment method within 7-10 business days of receiving the package.</li>
                        </ul>
                    </div>
                );
            case "security":
                return (
                    <div className="policy-content">
                        <h2 className="policy-content-title">Payment & Security</h2>
                        <p className="policy-section-text">
                            Shopping at Luminelle is secure. We use high-end encryption technologies and secure payment gateways to keep your financial details private.
                        </p>

                        <h3 className="policy-subheading">1. Secure Checkout Guarantee</h3>
                        <p className="policy-section-text">
                            Our store website utilizes 256-bit Secure Socket Layer (SSL) encryption to protect sensitive data during checkout. This ensures that your credit card credentials, login details, and addresses are fully protected from unauthorized access.
                        </p>

                        <h3 className="policy-subheading">2. PCI-DSS Compliance</h3>
                        <p className="policy-section-text">
                            All credit card transactions on Luminelle adhere strictly to the Payment Card Industry Data Security Standard (PCI-DSS), managed by the major card brands. This standard ensures the safe handling of cardholder data.
                        </p>

                        <h3 className="policy-subheading">3. Frequently Asked Questions (FAQs)</h3>
                        <p className="policy-section-text">
                            <strong>What payment types do you support?</strong> We accept Visa, Mastercard, American Express, PayPal, and Apple Pay.
                        </p>
                        <p className="policy-section-text">
                            <strong>What if I receive a broken or incorrect item?</strong> Please take a photo of the damaged product and email it to help@luminelle.com within 48 hours of delivery. We will immediately dispatch a replacement shipment at zero extra charge.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout title="Privacy Policy - Luminelle">
            <div className="policy-page-wrapper">
                {/* Hero Banner */}
                <div className="page-hero-banner">
                    <h1 className="page-hero-title">Policies & Terms</h1>
                    <p className="page-hero-subtitle">
                        Learn more about how we protect your security, our shipping regulations, and terms of service.
                    </p>
                </div>

                {/* Tabbed Content */}
                <div className="policy-tabbed-container">
                    <div className="policy-sidebar">
                        <button
                            className={`policy-tab-btn ${activeTab === "privacy" ? "active" : ""}`}
                            onClick={() => setActiveTab("privacy")}
                        >
                            <FaShieldAlt /> Privacy Policy
                        </button>
                        <button
                            className={`policy-tab-btn ${activeTab === "terms" ? "active" : ""}`}
                            onClick={() => setActiveTab("terms")}
                        >
                            <FaFileContract /> Terms of Service
                        </button>
                        <button
                            className={`policy-tab-btn ${activeTab === "shipping" ? "active" : ""}`}
                            onClick={() => setActiveTab("shipping")}
                        >
                            <FaTruck /> Shipping & Returns
                        </button>
                        <button
                            className={`policy-tab-btn ${activeTab === "security" ? "active" : ""}`}
                            onClick={() => setActiveTab("security")}
                        >
                            <FaLock /> Payment & Security
                        </button>
                    </div>

                    <div className="policy-content-card">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Policy;
import React from "react";
import Layout from "./../components/Layout/Layout";
import { FaLeaf, FaGem, FaHeart } from "react-icons/fa";

const About = () => {
    return (
        <Layout title="About Us - Luminelle">
            <div className="about-page-wrapper">
                {/* Hero Banner */}
                <div className="page-hero-banner">
                    <h1 className="page-hero-title">About Luminelle</h1>
                    <p className="page-hero-subtitle">
                        Discover our journey, our values, and our commitment to clean, premium beauty.
                    </p>
                </div>

                {/* Main Content */}
                <div className="about-container">
                    <div className="about-left">
                        <img
                            src="/images/about.jpg"
                            alt="About Luminelle"
                            className="about-img"
                        />
                    </div>

                    <div className="about-right">
                        <h2 className="about-title">Our Story</h2>
                        <p className="about-text">
                            Welcome to <strong>Luminelle</strong> ✨ — your ultimate destination for premium beauty and skincare products. Our journey began with a simple belief: everyone deserves access to clean, effective, and luxurious beauty solutions that enhance their unique self.
                        </p>
                        <p className="about-text">
                            We believe beauty is all about confidence and self-expression. Our mission is to provide high-quality, affordable cosmetics that help you glow from the inside out every single day 💄
                        </p>
                        <p className="about-text">
                            From nourishing skincare essentials to rich, high-pigment makeup must-haves, we carefully select and curate products that align with your lifestyle, celebrate your natural beauty, and match your individual vibe.
                        </p>
                    </div>
                </div>

                {/* Brand Values Grid */}
                <div className="about-values-section">
                    <div className="container">
                        <h2 className="values-title">Our Core Values</h2>
                        <div className="values-grid">
                            {/* Card 1 */}
                            <div className="value-card">
                                <div className="value-icon-container">
                                    <FaLeaf />
                                </div>
                                <h3>Cruelty Free</h3>
                                <p>
                                    100% vegan and cruelty-free. We firmly believe in beauty that does no harm to animals or the environment.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="value-card">
                                <div className="value-icon-container">
                                    <FaGem />
                                </div>
                                <h3>Premium Quality</h3>
                                <p>
                                    Formulated with premium, dermatologist-tested ingredients to ensure safety, efficiency, and a luxurious feel.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="value-card">
                                <div className="value-icon-container">
                                    <FaHeart />
                                </div>
                                <h3>Inclusive Beauty</h3>
                                <p>
                                    Designed for all skin types, tones, and genders. Celebrating diversity and empowering self-love.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default About;
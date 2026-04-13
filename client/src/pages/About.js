import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
    return (
        <Layout>
            <div className="about-container">
                <div className="about-left">
                    <img
                        src="/images/about.jpg"
                        alt="about"
                        className="about-img"
                    />
                </div>

                <div className="about-right">
                    <h1 className="about-title">About Us</h1>

                    <p className="about-text">
                        Welcome to <strong>Luminelle</strong> ✨ — your go-to destination for
                        premium beauty and skincare products.
                    </p>

                    <p className="about-text">
                        We believe beauty is all about confidence and self-expression. Our
                        mission is to provide high-quality, affordable cosmetics that help
                        you glow every day 💄
                    </p>

                    <p className="about-text">
                        From skincare essentials to makeup must-haves, we carefully curate
                        products that match your vibe and enhance your natural beauty.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default About;
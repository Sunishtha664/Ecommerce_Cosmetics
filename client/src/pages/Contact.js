import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport, BiTime } from "react-icons/bi";
import { toast } from "react-toastify";

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            toast.error("Please fill in all fields");
            return;
        }
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        toast.success(`Thank you, ${name}! Your message has been sent successfully. ✨`);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
    };

    return (
        <Layout title="Contact Us - Luminelle">
            <div className="contact-page-wrapper">
                {/* Hero Banner */}
                <div className="page-hero-banner">
                    <h1 className="page-hero-title">Contact Us</h1>
                    <p className="page-hero-subtitle">
                        Have questions or feedback? We would love to hear from you. Get in touch with our team.
                    </p>
                </div>

                <div className="contact-container">
                    {/* Left Column: Info Cards */}
                    <div className="contact-left">
                        <div>
                            <h2 className="about-title mb-4">Get In Touch</h2>
                            <p className="about-text mb-4">
                                Whether you have questions about our products, orders, shipping, or partnerships, our customer service team is here to assist you.
                            </p>
                        </div>

                        <div className="contact-details-grid">
                            <div className="contact-detail-card">
                                <div className="contact-detail-icon">
                                    <BiMailSend />
                                </div>
                                <div className="contact-detail-info">
                                    <span className="contact-detail-label">Email Support</span>
                                    <span className="contact-detail-val">help@luminelle.com</span>
                                </div>
                            </div>

                            <div className="contact-detail-card">
                                <div className="contact-detail-icon">
                                    <BiPhoneCall />
                                </div>
                                <div className="contact-detail-info">
                                    <span className="contact-detail-label">Call Support</span>
                                    <span className="contact-detail-val">+977 9813586192</span>
                                </div>
                            </div>

                            <div className="contact-detail-card">
                                <div className="contact-detail-icon">
                                    <BiSupport />
                                </div>
                                <div className="contact-detail-info">
                                    <span className="contact-detail-label">Toll Free Support</span>
                                    <span className="contact-detail-val">1800-0000-0000</span>
                                </div>
                            </div>

                            <div className="contact-detail-card">
                                <div className="contact-detail-icon">
                                    <BiTime />
                                </div>
                                <div className="contact-detail-info">
                                    <span className="contact-detail-label">Support Hours</span>
                                    <span className="contact-detail-val">Mon - Fri: 9:00 AM - 6:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="contact-right">
                        <div className="contact-form-card">
                            <h3 className="contact-form-title">Send a Message</h3>
                            <p className="contact-form-desc">
                                Fill out the form below and we will respond to you within 24 hours.
                            </p>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group-custom">
                                    <label htmlFor="nameInput">Full Name</label>
                                    <input
                                        id="nameInput"
                                        type="text"
                                        className="contact-input"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group-custom">
                                    <label htmlFor="emailInput">Email Address</label>
                                    <input
                                        id="emailInput"
                                        type="email"
                                        className="contact-input"
                                        placeholder="Your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group-custom">
                                    <label htmlFor="subjectInput">Subject</label>
                                    <input
                                        id="subjectInput"
                                        type="text"
                                        className="contact-input"
                                        placeholder="How can we help?"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group-custom">
                                    <label htmlFor="messageInput">Message</label>
                                    <textarea
                                        id="messageInput"
                                        className="contact-textarea"
                                        placeholder="Write your message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn-premium mt-2">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;
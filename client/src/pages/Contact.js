import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
    return (
        <Layout title="Contact Us - Luminelle">
            <div className="contact-container">
                <div className="contact-left">
                    <img
                        src="/images/contactus.jpg"
                        alt="contact"
                        className="contact-img"
                    />
                </div>

                <div className="contact-right">
                    <h1 className="contact-title">Contact Us</h1>

                    <p className="contact-text">
                        Any queries or product info? Feel free to contact us anytime.
                        We’ll get back to you within 24 hours.
                    </p>

                    <div className="contact-info">
                        <p>
                            <BiMailSend className="icon" />
                            help@luminelle.com
                        </p>

                        <p>
                            <BiPhoneCall className="icon" />
                            +977 9813586192
                        </p>

                        <p>
                            <BiSupport className="icon" />
                            1800-0000-0000 (Toll Free)
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;
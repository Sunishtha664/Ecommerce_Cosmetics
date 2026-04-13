import React from "react";
import Layout from "./../components/Layout/Layout";

const PrivacyPolicy = () => {
    return (
        <Layout>
            <div className="privacy-wrapper">

                <div className="privacy-left">
                    <img
                        src="/images/privacy.jpg"
                        alt="privacy"
                        className="privacy-img"
                    />
                </div>

                <div className="privacy-right">
                    <h1 className="privacy-title">Privacy Policy</h1>

                    <p className="privacy-text">
                        At <strong>Luminelle</strong>, your privacy is our priority. We are committed
                        to protecting your personal information and ensuring a safe shopping experience.
                    </p>

                    <p className="privacy-text">
                        We collect basic details like your name, email, and address only to
                        process orders and improve our services.
                    </p>

                    <p className="privacy-text">
                        Your data is securely stored and never sold or shared with third parties
                        except for order delivery purposes.
                    </p>

                    <p className="privacy-text">
                        By using our website, you agree to our privacy practices and policies.
                    </p>
                </div>

            </div>
        </Layout>
    );
};

export default PrivacyPolicy;
import React from 'react'
import Header from './Header.js'
import Footer from './Footer.js'
import { Helmet } from 'react-helmet'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const Layout = ({ children, title, description, keywords, author }) => {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{title}</title>

                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />

            </Helmet>
            <Header />

            <main style={{ minHeight: '70vh' }}> <ToastContainer />{children}</main>
            <Footer />

        </div>
    )
}
Layout.defaultProps = {
    title: "Luminelle - Your Beauty Destination",
    description: "Discover the best in beauty with Luminelle. Shop our wide range of cosmetics, skincare, and haircare products to enhance your natural beauty.",
    keywords: "beauty, cosmetics, skincare, haircare, makeup, Luminelle",
    author: "Luminelle Team"
}
export default Layout

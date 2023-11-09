import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import notfound from "../assets/notfound.svg"
import "./PageNotFound.css"
import { Helmet } from "react-helmet"

const PageNotFound = () => {
    return (
        <>
        <Helmet>
            <title>Page Not Found | Unitastic</title>
        </Helmet>
        <Navbar />
        <div className="container notfound-container">
            <div className="row d-flex align-items-center justify-content-center">
                <div className="col-lg-6 text-center">
                    <img src={notfound} alt="404" className="notfound-img" />
                    <h1 className="notfound-title">404</h1>
                    <h2 className="notfound-subtitle">Page Not Found</h2>
                    <p className="notfound-text">The page you are looking for does not exist or has been moved.</p>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default PageNotFound
import Navbar from "../components/Navbar/Navbar"
import "./Home.css"
import collegestudents from "../assets/collegestudents.svg"
import Footer from "../components/Footer/Footer"
import library from "../assets/library.svg"
import calculator from "../assets/calculator.svg"
import Quote from "../components/Quote/Quote"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import { useEffect } from "react"
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.min.css"

const Home = () => {

    // const AndroidToast = () => (
    //     <div className="toast-content text-center">
    //         Unitastic is now available for Android! Download it&nbsp;
    //         <a href="https://1drv.ms/u/s!AqPn_d7bfTh2cnjPYfnfxXwbC2c?e=gS4vKo" target="_blank" rel="noreferrer">here</a>.
    //     </div>
    // )

    // const notify = () => toast(
    //     <AndroidToast />,
    //     {
    //         position: toast.POSITION.BOTTOM_CENTER,
    //         autoClose: false,
    //     }
    // )

    useEffect(() => {
        // notify()
        if (window.adsbygoogle && !window.adsbygoogle.loaded) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [])

    return (
        <>
            <Helmet>
                <title>Unitastic</title>
                <link rel="canonical" href="https://unitastic.netlify.app/" />
            </Helmet>
            {/* <ToastContainer /> */}
            <Navbar />
            <div className="container landing">
                <div className="row gy-5 landing-inner">
                    <div className="col-lg-6">
                        <h1 className="landing-title">Unitastic</h1>
                        <h2 className="landing-subtitle">A one-stop solution for all your university needs</h2>
                        <div className="landing-line my-4"></div>
                        <p className="landing-text">
                            Unitastic is a collection of tools and utilities that will help you get 
                            through your university life with ease. From calculating your SGPA to 
                            finding out number of classes you can skip, Unitastic has it all.
                        </p>
                        <p className="landing-text">
                            Unitastic also provides you with all the materials you need for your
                            university life, be it notes, previous question papers, or even textbooks.
                        </p>
                        <Link to="/semesters" className="btn btn-primary rounded-5 me-2 mb-2">Get Materials</Link>
                        <a href="https://1drv.ms/u/s!AqPn_d7bfTh2cnjPYfnfxXwbC2c?e=gS4vKo" target="_blank" rel="noreferrer" className="btn btn-primary rounded-5 me-2 mb-2">Download Android App</a>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-center">
                        <img src={collegestudents} className="img-fluid" alt="College Students" />
                    </div>
                </div>
            </div>
            <Quote />
            <div className="services-container p-3">
                <div className="container">
                    <div className="mt-5 d-flex justify-content-center">
                        {/* Unitastic Horizontal Banner */}
                        <ins className="adsbygoogle"
                            style={{ display: "block" }}
                            data-ad-client="ca-pub-7240094938519313"
                            data-ad-slot="1796885446"
                            data-ad-format="auto"
                            data-full-width-responsive="true"></ins>
                    </div>
                    <div className="row mt-5">
                        <div className="col-lg-6 d-flex justify-content-center">
                            <img src={library} className="img-fluid" alt="Materials" />
                        </div>
                        <div className="col-lg-6">
                            <h2 className="services-title mt-5 mb-4">Materials</h2>
                            <p className="services-text">
                                Get all the materials you need for your university life, be it notes,
                                previous question papers, or even textbooks.
                                <br /> <br />
                                Content in Unitastic is curated from students and teachers belonging
                                to various departments and schools across the university.
                                <br /> <br />
                                You can also contribute to Unitastic by uploading your own materials.
                                <br /> <br />
                                If you find any discrepancies in the content, you can report it to us
                                using the feedback form and we will take care of it.
                                <br /> <br />
                                <Link to="/semesters" className="btn btn-primary rounded-5">Get Materials</Link>
                            </p>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-lg-6 d-flex d-lg-none justify-content-center">
                            <img src={calculator} className="img-fluid" alt="Calculator" />
                        </div>
                        <div className="col-lg-6">
                            <h2 className="services-title mt-5 mb-4">Utilities</h2>
                            <p className="services-text">
                                Calculate your SGPA, CGPA, find out how many classes you can skip,
                                and much more with Unitastic&apos;s utilities.
                                <br /> <br />
                                Unitastic utilities are designed to make your university life easier
                                by simplifying and bringing together all the tools you need in one place.
                                <br /> <br />
                                If you have any suggestions for new utilities, you can let us know
                                using the feedback form.
                            </p>
                            <Link to="/sgpa" className="btn btn-primary me-2 mb-2 rounded-5">SGPA Calculator</Link>
                            <Link to="/cgpa" className="btn btn-primary me-2 mb-2 rounded-5">CGPA Calculator</Link>
                            <Link to="/targetcgpa" className="btn btn-primary me-2 mb-2 rounded-5">Required SGPA Calculator</Link>
                            <Link to="/attendance" className="btn btn-primary me-2 mb-2 rounded-5">Skippability Calculator</Link>
                            <Link to="/externals" className="btn btn-primary me-2 mb-2 rounded-5">Expected Externals Calculator</Link>
                        </div>
                        <div className="col-lg-6 d-none d-lg-flex justify-content-center">
                            <img src={calculator} className="img-fluid" alt="Calculator" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home
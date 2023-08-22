import Navbar from "../components/Navbar"
import "./Home.css"
import studentsillustration from "../assets/collegestudents.svg"

const Home = () => {
    return (
        <>
            <Navbar />
            <div className="container landing">
                <div className="row landing-inner">
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
                            university life, be it notes, question papers, or even textbooks.
                        </p>
                    </div>
                    <div className="col-lg-6">
                        <img src={studentsillustration} className="img-fluid" alt="placeholder" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
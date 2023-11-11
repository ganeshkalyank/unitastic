import { Helmet } from "react-helmet"
import notfound from "../../assets/notfound.svg"
import "./Maintenance.css"

const Maintenance = () => {
    return (
        <>
            <Helmet>
                <title>Unitastic</title>
                <link rel="canonical" href="https://unitastic.netlify.app/" />
            </Helmet>
            <div className="container maintenance-container">
                <h1 className="maintenance-title text-center">Unitastic</h1>
                <div className="d-flex justify-content-center">
                    <img src={notfound} className="maintenance-img" alt="Not Found" />
                </div>
                <h1 className="maintenance-title text-center">Under Maintenance!</h1>
            </div>
        </>
    )
}

export default Maintenance

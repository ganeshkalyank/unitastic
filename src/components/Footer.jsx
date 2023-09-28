import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="p-3 shadow bg-white">
            <p className="text-center">© Copyright Unitastic 2023. All rights reserved.</p>
            <p className="text-center">
                <Link to="/terms" className="form-text">Terms and Conditions</Link>
                &nbsp;.&nbsp;
                <Link to="/credits" className="form-text">Credits</Link>
            </p>
        </footer>
    )
}

export default Footer
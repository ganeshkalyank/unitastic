import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons'
import './Navbar.css'

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow fixed-top bg-white">
            <div className="container-fluid">
                <a href="/" className="navbar-brand">Unitastic</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <FontAwesomeIcon icon={faBarsStaggered}/>
                </button>
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav text-center ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a href="/semesters" className="nav-link">Materials</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Utilities
                            </a>
                            <ul className="dropdown-menu text-center">
                                <li><a className="dropdown-item" href="/sgpa">SGPA Calculator</a></li>
                                <li><a className="dropdown-item" href="/externals">Expected Externals</a></li>
                                <li><a className="dropdown-item" href="/attendance">Class Skippability</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Useful Links
                            </a>
                            <ul className="dropdown-menu text-center">
                                <li><a className="dropdown-item" href="https://webstream.sastra.edu/sastrapwi/" target="_blank">Student Web Interface</a></li>
                                <li><a className="dropdown-item" href="https://webstream.sastra.edu/sastraparentweb/" target="_blank">Parent Web Interface</a></li>
                                <li><a className="dropdown-item" href="https://biometric.sastra.edu/" target="_blank">Hostel Leave Portal</a></li>
                                <li><a className="dropdown-item" href="https://www.sastra.edu/downloads/menu/Academics/Academic_Calender_2023_24_TPJ.pdf" target="_blank">Academic Calendar</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Archives
                            </a>
                            <ul className="dropdown-menu text-center">
                                <li><a className="dropdown-item" href="https://materialbase.github.io/" target="_blank">Material Base</a></li>
                                <li><a className="dropdown-item" href="https://linktr.ee/materialhub" target="_blank">Material Hub</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Contribute
                            </a>
                            <ul className="dropdown-menu text-center dropdown-menu-end">
                                <li><a className="dropdown-item" href="/contribute">Materials</a></li>
                                <li><a className="dropdown-item" href="/feedback">Feedback</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
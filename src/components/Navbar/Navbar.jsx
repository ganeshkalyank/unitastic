import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { useState } from 'react'
import { useEffect } from 'react'
import { auth } from '../../firebase'

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true)
            }
        })
    }, [])

    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow fixed-top bg-white">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Unitastic</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <FontAwesomeIcon icon={faBarsStaggered}/>
                </button>
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav text-center ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/semesters" className="nav-link">Materials</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Utilities
                            </a>
                            <ul className="dropdown-menu text-center">
                                <li><Link className="dropdown-item" to="/sgpa">SGPA Calculator</Link></li>
                                <li><Link className="dropdown-item" to="/cgpa">CGPA Calculator</Link></li>
                                <li><Link className="dropdown-item" to="/targetcgpa">Required SGPA</Link></li>
                                <li><Link className="dropdown-item" to="/externals">Expected Externals</Link></li>
                                <li><Link className="dropdown-item" to="/attendance">Class Skippability</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Useful Links
                            </a>
                            <ul className="dropdown-menu text-center">
                                <li><a className="dropdown-item" href="https://webstream.sastra.edu/sastrapwi/" target="_blank" rel="noreferrer">Student Web Interface</a></li>
                                <li><a className="dropdown-item" href="https://webstream.sastra.edu/sastraparentweb/" target="_blank" rel="noreferrer">Parent Web Interface</a></li>
                                <li><a className="dropdown-item" href="https://biometric.sastra.edu/" target="_blank" rel="noreferrer">Hostel Leave Portal</a></li>
                                <li><a className="dropdown-item" href="https://sastra.edu/downloads/menu/Academics/2024-25/MC_Academic_Calendar_2024-25.pdf" target="_blank" rel="noreferrer">Academic Calendar</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Archives
                            </a>
                            <ul className="dropdown-menu text-center">
                                <li><a className="dropdown-item" href="https://materialbase.github.io/" target="_blank" rel="noreferrer">Material Base</a></li>
                                <li><a className="dropdown-item" href="https://linktr.ee/materialhub" target="_blank" rel="noreferrer">Material Hub</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Contribute
                            </a>
                            <ul className="dropdown-menu text-center dropdown-menu-end">
                                <li><Link className="dropdown-item" to="/contribute">Materials</Link></li>
                                <li><Link className="dropdown-item" to="/feedback">Feedback</Link></li>
                                <li><a className="dropdown-item" href="https://buymeacoffee.com/xoidykilr" target="_blank" rel="noreferrer">Buy me a coffee</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            {
                                loggedIn
                                ? <Link to="/profile" className="nav-link">Profile</Link>
                                : <Link to="/login" className="nav-link">Login</Link>
                            
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

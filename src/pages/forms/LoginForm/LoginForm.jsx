import { Helmet } from "react-helmet"
import Navbar from "../../../components/Navbar/Navbar"
import Footer from "../../../components/Footer/Footer"
import "./LoginForm.css"
import { useState } from "react"
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { auth } from "../../../firebase"

const LoginForm = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const [submitting, setSubmitting] = useState(false)
    const [response, setResponse] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await signInWithEmailAndPassword(auth, user.email, user.password)
            setResponse("Login successful.")
            navigate("/profile")
            setSubmitting(false)
        } catch (error) {
            if (error.code === "auth/invalid-email") {
                setResponse("Invalid email.")
            } else if (error.code === "auth/user-disabled") {
                setResponse("User disabled. Please contact support.")
            } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                setResponse("Invalid email or password.")
            } else {
                setResponse("An error occurred. Please try again later.")
            }
            setSubmitting(false)
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/profile")
            }
        })
    }, [navigate])

    return (
        <>
        <Helmet>
            <title>Login | Unitastic</title>
            <link rel="canonical" href="https://unitastic.netlify.app/login" />
        </Helmet>
        <Navbar />
        <div className="container login-form">
            <div className="row d-flex justify-content-center p-3">
                <div className="col-lg-6 shadow bg-white rounded-3 p-3">
                    <h3 className="text-center">Login</h3>
                    <p>
                        Login to receive personalised content and access
                        member-only features.
                    </p>
                    <hr />
                    <form onSubmit={handleLogin}>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => setUser({...user, email: e.target.value})} required />
                            <label htmlFor="email">Email*</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => setUser({...user, password: e.target.value})} required />
                            <label htmlFor="password">Password*</label>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-5" disabled={submitting}>Login</button>
                        <p className="text-center mt-3">{response}</p>
                    </form>
                    <hr />
                    <p className="text-center">
                        Don&apos;t have an account? <Link to="/signup">Signup</Link>
                    </p>
                </div>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default LoginForm

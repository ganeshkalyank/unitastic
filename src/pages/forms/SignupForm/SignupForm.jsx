import { Helmet } from "react-helmet"
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, updateProfile } from "firebase/auth"
import Navbar from "../../../components/Navbar/Navbar"
import Footer from "../../../components/Footer/Footer"
import "./SignupForm.css"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../../../firebase"

const SignupForm = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [submitting, setSubmitting] = useState(false)
    const [response, setResponse] = useState("")

    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
            const newUser = userCredential.user
            await updateProfile(newUser, {
                displayName: user.name
            })
            await sendEmailVerification(newUser)
            setResponse("Signup successful. Please check your inbox for verification email.")
            setSubmitting(false)
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setResponse("Email already in use.")
            } else if (error.code === "auth/invalid-email") {
                setResponse("Invalid email.")
            } else if (error.code === "auth/weak-password") {
                setResponse("Weak password.")
            } else {
                setResponse("An error occurred. Please try again later.")
            }
            setSubmitting(false)
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/semesters")
            }
        })
    }, [navigate])

    return (
        <>
        <Helmet>
            <title>Signup | Unitastic</title>
            <link rel="canonical" href="https://unitastic.netlify.app/signup" />
        </Helmet>
        <Navbar />
        <div className="container signup-form">
            <div className="row d-flex justify-content-center p-3">
                <div className="col-lg-6 shadow bg-white rounded-3 p-3">
                    <h3 className="text-center">Signup</h3>
                    <p>
                        Signup to receive personalised content and access
                        member-only features.
                    </p>
                    <hr />
                    <form onSubmit={handleSignup}>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="name" placeholder="Name" onChange={(e) => setUser({...user, name: e.target.value})} required />
                            <label htmlFor="name">Name*</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => setUser({...user, email: e.target.value})} required />
                            <label htmlFor="email">Email*</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => setUser({...user, password: e.target.value})} required />
                            <label htmlFor="password">Password*</label>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-5" disabled={submitting}>Signup</button>
                        <p className="text-center mt-3">{response}</p>
                    </form>
                    <hr />
                    <p className="text-center">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default SignupForm

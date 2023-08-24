import { useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./FeedbackForm.css"

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState({})
    const [response, setResponse] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const feedbackHandler = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const response = await axios.post("https://formspree.io/f/xpzgdybl", feedback)
            if (response.status !== 200) {
                throw new Error()
            }
            setResponse("Thank you for your feedback. We will review it and take necessary action.")
            setSubmitting(false)
        } catch (error) {
            setResponse("Oops! Something went wrong. Please try again.")
            setSubmitting(false)
        }
    }
    return (
        <>
            <Navbar />
            <div className="container feedback-form">
                <div className="row d-flex justify-content-center p-3">
                    <div className="col-lg-6 shadow bg-white rounded-3 p-3">
                        <h3 className="text-center">Feedback</h3>
                        <p>
                            We would love to hear your feedback about Unitastic. Please let us know
                            if you have any suggestions or if you find any discrepancies in the
                            content.
                        </p>
                        <hr />
                        <form onSubmit={feedbackHandler}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="name" placeholder="Name" onChange={(e) => setFeedback({...feedback, name: e.target.value})} required />
                                <label htmlFor="name">Name*</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => setFeedback({...feedback, email: e.target.value})} required />
                                <label htmlFor="email">Email*</label>
                            </div>
                            <div className="form-floating mb-3">
                                <select className="form-select" id="type" onChange={(e) => setFeedback({...feedback, type: e.target.value})} required>
                                    <option value="" disabled selected>Select Feedback Type</option>
                                    <option value="suggestion">Suggestion</option>
                                    <option value="discrepancy">Discrepancy</option>
                                </select>
                                <label htmlFor="type">Feedback Type*</label>
                            </div>
                            <div className="form-floating mb-3">
                                <textarea className="form-control" id="message" placeholder="Message" onChange={(e) => setFeedback({...feedback, message: e.target.value})} required></textarea>
                                <label htmlFor="message">Message*</label>
                            </div>
                            <p className="form-text">* Fields marked with an asterisk are mandatory.</p>
                            <button type="submit" className="btn btn-primary rounded-5" disabled={submitting}>Submit</button>
                            <p className="text-center mt-3">{response}</p>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default FeedbackForm
import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import "./ContributionForm.css"

const ContributionForm = () => {
    const [contribution, setContribution] = useState({})
    const [response, setResponse] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const contributeHandler = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            axios.post("https://formspree.io/f/xpzgdjwa", contribution)
            setResponse("Thank you for your contribution. We will review it and add it to our database.")
            setSubmitting(false)
        } catch (error) {
            setResponse("Oops! Something went wrong. Please try again.")
            setSubmitting(false)
        }
    }

    useEffect(() => {
        document.title = "Contribute | Unitastic"
    }, [])

    return (
        <>
            <Navbar />
            <div className="container contribution-form">
                <div className="row d-flex justify-content-center p-3">
                    <div className="col-lg-6 shadow bg-white rounded-3 p-3">
                        <h3 className="text-center">Contribute</h3>
                        <p>
                            Contribute to Unitastic by adding any missing materials, previous
                            question papers, textbooks or Presentations.
                        </p>
                        <hr />
                        <form onSubmit={contributeHandler}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="name" placeholder="Name" onChange={(e) => setContribution({...contribution, name: e.target.value})} required />
                                <label htmlFor="name">Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => setContribution({...contribution, email: e.target.value})} required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="semester" placeholder="Semester" onChange={(e) => setContribution({...contribution, semester: e.target.value})} required />
                                <label htmlFor="semester">Semester</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="department" placeholder="Department" onChange={(e) => setContribution({...contribution, department: e.target.value})} required />
                                <label htmlFor="department">Department</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="subject" placeholder="Subject" onChange={(e) => setContribution({...contribution, subject: e.target.value})} required />
                                <label htmlFor="subject">Subject</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="driveurl" placeholder="Drive URL" onChange={(e) => setContribution({...contribution, driveurl: e.target.value})} required />
                                <label htmlFor="driveurl">Drive URL</label>
                            </div>
                            <button className={"btn btn-primary rounded-5 mb-3"+(submitting?" disabled":"")} type="submit">{ submitting ? "Submitting..." : "Submit" }</button>
                            <div className="response">{response}</div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContributionForm
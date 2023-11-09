import { useState } from "react"
import { logEvent } from "firebase/analytics"
import { analytics } from "../main"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./SGPAforCGPA.css"
import { Helmet } from "react-helmet"

const SGPAforCGPA = () => {

    const [cgpaGoal, setCGPAGoal] = useState(0.0)
    const [currentCGPA, setCurrentCGPA] = useState(0.0)
    const [currentCredits, setCurrentCredits] = useState(0)
    const [pastCredits, setPastCredits] = useState(0)
    const [sgpa, setSGPA] = useState(0.0)

    const calculateSGPA = () => {
        const x = cgpaGoal*(currentCredits+pastCredits)
        const y = currentCGPA*pastCredits
        setSGPA((x-y)/currentCredits)
        logEvent(analytics, 'calculated_sgpa', {cgpaGoal: cgpaGoal, currentCGPA: currentCGPA, currentCredits: currentCredits, pastCredits: pastCredits, sgpa: sgpa})
    }

    return (
        <>
            <Helmet>
                <title>Required SGPA Calculator | Unitastic</title>
                <link rel="canonical" href="https://unitastic.netlify.app/targetcgpa" />
            </Helmet>
            <Navbar />
            <div className="container sgforcg-container">
                <div className="row d-flex justify-content-center p-3">
                    <div className="col-lg-6 container shadow bg-white p-3 rounded-3">
                        <h4 className="text-center">Required SGPA Calculator</h4>
                        <p>Calculate required SGPA for achieving a target CGPA.</p>
                        <hr />
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="cgpagoal" placeholder="." onChange={(e) => setCGPAGoal(parseFloat(e.target.value))}/>
                            <label htmlFor="cgpagoal">CGPA Goal</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="currentcgpa" placeholder="." onChange={(e) => setCurrentCGPA(parseFloat(e.target.value))}/>
                            <label htmlFor="currentcgpa">Current CGPA</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="currentcredits" placeholder="." onChange={(e) => setCurrentCredits(parseFloat(e.target.value))}/>
                            <label htmlFor="currentcredits">Current Semester Credits</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="pastcredits" placeholder="." onChange={(e) => setPastCredits(parseFloat(e.target.value))}/>
                            <label htmlFor="pastcredits">Credits till Last Semester</label>
                        </div>
                        <hr />
                        <button className="btn btn-primary rounded-5" onClick={calculateSGPA}>Calculate</button>
                        <h5 className="text-center mt-3">
                            { sgpa <= 10 && sgpa >=0 ? "Required SGPA is "+sgpa.toFixed(4) : "Not Achievable" }
                        </h5>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default SGPAforCGPA
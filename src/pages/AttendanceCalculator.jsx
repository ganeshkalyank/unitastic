import { logEvent } from "firebase/analytics"
import { useState } from "react"
import { analytics } from "../main"
import Navbar from "../components/Navbar"

const AttendanceCalculator = () => {
    const [credits, setCredits] = useState(0)
    const [bunked, setBunked] = useState(0)
    const [canBunk, setCanBunk] = useState(0)
    
    const calculateCanBunk = () => {
        setCanBunk(Math.floor((credits * 16 * 0.2) - bunked))
        logEvent(analytics, 'calculated_attendance', {credits: credits, bunked: bunked, canBunk: canBunk})
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: "20vh", marginBottom: "20vh" }}>
                <div className="row d-flex justify-content-center p-3 mt-5">
                    <div className="col-lg-6 container shadow bg-white p-3 rounded-3 bg-white">
                        <h4 className="text-center">Class Skippability Calculator</h4>
                        <hr />
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="credits" placeholder="." onChange={(e) => setCredits(e.target.value)} />
                            <label htmlFor="credits">Credits</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="bunked" placeholder="." onChange={(e) => setBunked(e.target.value)} />
                            <label htmlFor="bunked">Skipped</label>
                        </div>
                        <button className="btn btn-primary rounded-5" onClick={calculateCanBunk}>Calculate</button>
                        <hr />
                        {
                            canBunk > 0 ? <h5 className="text-center">You can skip {canBunk} classes</h5> : <h5 className="text-center">You can't skip any classes</h5>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default AttendanceCalculator
import { useState } from "react"
import Navbar from "../../../components/Navbar/Navbar"
import Footer from "../../../components/Footer/Footer"
import "./AttendanceCalculator.css"
import { Helmet } from "react-helmet-async"
import { calculateCanBunk } from "../../../utils/calculators"
import { BASE_URL } from "../../../utils/constants"

const AttendanceCalculator = () => {
    const [credits, setCredits] = useState(0)
    const [bunked, setBunked] = useState(0)
    const [canBunk, setCanBunk] = useState(0)

    return (
        <>
            <Helmet>
                <title>Class Skippability | Unitastic</title>
                <link rel="canonical" href={ BASE_URL+"/attendance" } />
            </Helmet>
            <Navbar />
            <div className="container attendance-container">
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
                        <button className="btn btn-primary rounded-5" onClick={() => setCanBunk(calculateCanBunk(credits, bunked))}>Calculate</button>
                        <hr />
                        {
                            canBunk > 0 ? <h5 className="text-center">You can skip {canBunk} classes</h5> : <h5 className="text-center">You can&apos;t skip any classes</h5>
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AttendanceCalculator
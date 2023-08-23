import { logEvent } from "firebase/analytics"
import { useEffect, useState } from "react"
import { analytics } from "../main"
import Navbar from "../components/Navbar"

const ExpectedExternals = () => {
    const [externals, setExternals] = useState({})

    const calculateExternals = (internals) => {
        if (internals > 50) {
            setExternals({
                "S": "NA",
                "A+": "NA",
                "A": "NA",
                "B": "NA",
                "C": "NA",
                "D": "NA"
            })
            return
        }
        const cutoff = {"S": 91, "A+": 86, "A": 75, "B": 66, "C": 55, "D": 50}
        setExternals({
            "S": (cutoff["S"] - internals) * 2,
            "A+": (cutoff["A+"] - internals) * 2,
            "A": (cutoff["A"] - internals) * 2,
            "B": (cutoff["B"] - internals) * 2,
            "C": (cutoff["C"] - internals) * 2,
            "D": (cutoff["D"] - internals) * 2
        })
        logEvent(analytics, 'calculate_externals', {internals: internals})
    }

    useEffect(() => {
        document.title = "Expected Externals | Unitastic"
    }, [])

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: "20vh", marginBottom: "20vh" }}>
                <div className="row d-flex justify-content-center p-3 mt-5">
                    <div className="col-lg-6 container shadow bg-white p-3 rounded-3">
                        <h4 className="text-center">Expected Externals</h4>
                        <p>Calculate the externals marks required to get each overall grade based on internal marks.</p>
                        <hr />
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="internals" placeholder="." onChange={(e) => calculateExternals(e.target.value)} />
                            <label htmlFor="internals">Internals</label>
                        </div>
                        <hr />
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th scope="col">Grade</th>
                                    <th scope="col">Externals</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>S</td>
                                    <td>{externals["S"]>100?"NA":externals["S"]}</td>
                                </tr>
                                <tr>
                                    <td>A+</td>
                                    <td>{externals["A+"]>100?"NA":externals["A+"]}</td>
                                </tr>
                                <tr>
                                    <td>A</td>
                                    <td>{externals["A"]>100?"NA":externals["A"]}</td>
                                </tr>
                                <tr>
                                    <td>B</td>
                                    <td>{externals["B"]>100?"NA":externals["B"]}</td>
                                </tr>
                                <tr>
                                    <td>C</td>
                                    <td>{externals["C"]>100?"NA":externals["C"]}</td>
                                </tr>
                                <tr>
                                    <td>D</td>
                                    <td>{externals["D"]>100?"NA":externals["D"]}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExpectedExternals
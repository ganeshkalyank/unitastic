import { useState } from "react"
import Navbar from "../../../components/Navbar/Navbar"
import Footer from "../../../components/Footer/Footer"
import "./ExpectedExternals.css"
import { Helmet } from "react-helmet-async"
import { calculateExternals } from "../../../utils/calculators"
import { BASE_URL } from "../../../utils/constants"

const ExpectedExternals = () => {
    const [externals, setExternals] = useState({})

    return (
        <>
            <Helmet>
                <title>Expected Externals | Unitastic</title>
                <link rel="canonical" href={ BASE_URL+"/externals" } />
            </Helmet>
            <Navbar />
            <div className="container externals-container">
                <div className="row d-flex justify-content-center p-3 mt-5">
                    <div className="col-lg-6 container shadow bg-white p-3 rounded-3">
                        <h4 className="text-center">Expected Externals</h4>
                        <p>Calculate the externals marks required to get each overall grade based on internal marks.</p>
                        <hr />
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="internals" placeholder="." onChange={(e) => setExternals(calculateExternals(e.target.value))} />
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
            <Footer />
        </>
    )
}

export default ExpectedExternals
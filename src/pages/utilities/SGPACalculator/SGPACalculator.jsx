import { useState } from "react"
import Navbar from "../../../components/Navbar/Navbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import Footer from "../../../components/Footer/Footer"
import "./SGPACalculator.css"
import { Helmet } from "react-helmet-async"
import { calculateSGPA } from "../../../utils/calculators"

const SGPACalculator = () => {
    const [subjects, setSubjects] = useState([])
    const [sgpa, setSGPA] = useState(0.0)

    const addSubject = () => {
        setSubjects([...subjects, { credits: 0, grade: "S" }])
    }

    return (
        <>
            <Helmet>
                <title>SGPA Calculator | Unitastic</title>
                <link rel="canonical" href="https://unitastic.netlify.app/sgpa" />
            </Helmet>
            <Navbar />
            <div className="container sgpa-container">
                <div className="row d-flex justify-content-center p-3">
                    <div className="col-lg-6 container shadow bg-white p-3 rounded-3">
                        <h4 className="text-center">SGPA Calculator</h4>
                        <p>Calculate your SGPA based on credits and expected grade.</p>
                        <hr />
                        <button className="btn btn-primary rounded-5" onClick={addSubject}>Add Subject</button>
                        {
                            subjects.map((subject, index) => {
                                return (
                                    <div className="row mt-3" key={index}>
                                        <div className="col-lg-2">
                                            <p className="mt-1">Subject {index+1}</p>
                                        </div>
                                        <div className="col-5 col-lg-4 mb-2 mb-lg-0">
                                            <input type="number" className="form-control" id={"credits"+index} placeholder="Credits" onChange={(e) => {
                                                setSubjects([...subjects.slice(0, index), { credits: e.target.value, grade: subjects[index].grade }, ...subjects.slice(index+1)])
                                            }} />
                                        </div>
                                        <div className="col-4 col-lg-4 mb-2 mb-lg-0">
                                            <select className="form-select" id={"grade"+index} onChange={(e) => {
                                                setSubjects([...subjects.slice(0, index), { credits: subjects[index].credits, grade: e.target.value }, ...subjects.slice(index+1)])
                                            }}>
                                                <option value="S">S</option>
                                                <option value="A+">A+</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                                <option value="F">F</option>
                                            </select>
                                        </div>
                                        <div className="col-3 col-lg-2">
                                            <button className="btn btn-danger d-flex justify-content-center align-items-center rounded-5" onClick={() => {
                                                setSubjects([...subjects.slice(0, index), ...subjects.slice(index+1)])
                                            }}><FontAwesomeIcon icon={faXmark} /></button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <hr />
                        <button className="btn btn-primary rounded-5" onClick={() => setSGPA(calculateSGPA(subjects))}>Calculate</button>
                        <h5 className="text-center mt-3">Your SGPA is {sgpa.toFixed(4)}</h5>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default SGPACalculator
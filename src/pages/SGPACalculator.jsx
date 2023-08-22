import { useState } from "react"
import { logEvent } from "firebase/analytics"
import { analytics } from "../main"
import Navbar from "../components/Navbar"

const SGPACalculator = () => {
    const [subjects, setSubjects] = useState([])
    const [sgpa, setSGPA] = useState(0.0)

    const addSubject = () => {
        setSubjects([...subjects, { credits: 0, grade: "S" }])
    }

    const calculateSGPA = () => {
        let totalCredits = 0
        let totalPoints = 0
        const grades = {"S": 10, "A+": 9, "A": 8, "B": 7, "C": 6, "D": 5, "F": 0}
        subjects.forEach(subject => {
            totalCredits += parseInt(subject.credits)
            totalPoints += parseInt(subject.credits) * grades[subject.grade]
        })
        setSGPA(totalPoints / totalCredits)
        logEvent(analytics, 'calculated_sgpa', {subjects: subjects, sgpa: sgpa})
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: "20vh", marginBottom: "20vh" }}>
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
                                        <div className="col-lg-4 mb-2 mb-lg-0">
                                            <input type="number" className="form-control" id={"credits"+index} placeholder="Credits" onChange={(e) => {
                                                setSubjects([...subjects.slice(0, index), { credits: e.target.value, grade: subjects[index].grade }, ...subjects.slice(index+1)])
                                            }} />
                                        </div>
                                        <div className="col-lg-4 mb-2 mb-lg-0">
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
                                        <div className="col-lg-2">
                                            <button className="btn btn-danger rounded-5" onClick={() => {
                                                setSubjects([...subjects.slice(0, index), ...subjects.slice(index+1)])
                                            }}><b>&times;</b></button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <hr />
                        <button className="btn btn-primary rounded-5" onClick={calculateSGPA}>Calculate</button>
                        <h5 className="mt-3">Expected SGPA: {sgpa.toFixed(4)}</h5>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SGPACalculator
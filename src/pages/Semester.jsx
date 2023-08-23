import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../main"
import Navbar from "../components/Navbar"
import "./Semester.css"

const Semester = () => {
    const [depts, setDepts] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)

    const { id } = useParams()

    const getData = async () => {
        const subjectsCollection = collection(db, "semesters", id, "subjects")
        const q1 = query(subjectsCollection, orderBy("name"))
        const subjectsSnapshot = await getDocs(q1)
        const subjectsList = subjectsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        setSubjects(subjectsList)

        const deptsCollection = collection(db, "semesters", id, "depts")
        const q2 = query(deptsCollection, orderBy("name"))
        const deptsSnapshot = await getDocs(q2)
        const deptsList = deptsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        setDepts(deptsList)
        
        setLoading(false)
    }

    useEffect(() => {
        getData()
        document.title = "Semester | Unitastic"
    }, [])

    return (
        <>
            <Navbar />
            { loading ? (
                <div className="container semester-container d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ): (
                <div className="container semester-container">
                    <h3 className="text-center">
                        {
                            depts.length > 0 ? "Select your Department" : "Select your Subject"
                        }
                    </h3>
                    <div className="row gy-2 mt-3">
                        {
                            depts.length > 0 ? (
                                depts.map(dept => (
                                    <div className="col-12 col-md-4 col-lg-3" key={dept.id}>
                                        <div className="card semester-card">
                                            <div className="card-body">
                                                <h5 className="card-title">{dept.name}</h5>
                                                <p className="card-text">{dept.description}</p>
                                                <a href={dept.url} target="_blank" className="btn btn-primary rounded-5">Select</a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                subjects.map(subject => (
                                    <div className="col-12 col-md-4 col-lg-3" key={subject.id}>
                                        <div className="card semester-card">
                                            <div className="card-body">
                                                <h5 className="card-title">{subject.name}</h5>
                                                <p className="card-text">{subject.description}</p>
                                                <a href={subject.url} target="_blank" className="btn btn-primary rounded-5">Select</a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            )}
        </>
    )
}

export default Semester
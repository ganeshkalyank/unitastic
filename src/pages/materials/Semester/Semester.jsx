import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { Helmet } from "react-helmet"
import { db } from "../../../firebase"
import Navbar from "../../../components/Navbar/Navbar"
import Footer from "../../../components/Footer/Footer"
import "./Semester.css"

const Semester = () => {
    const [depts, setDepts] = useState([])
    const [subjects, setSubjects] = useState([])
    const [semester, setSemester] = useState("Semester")
    const [loading, setLoading] = useState(true)

    const { id } = useParams()

    useEffect(() => {
        const getData = async () => {
            const semesterRef = collection(db, "semesters")
            const semesterSnapshot = await getDocs(semesterRef)
            const semesterList = semesterSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })).filter(semester => semester.id === id)
            setSemester(semesterList[0].name)

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
        getData()
        if (window.adsbygoogle && !window.adsbygoogle.loaded) {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
        }
    }, [id])

    return (
        <>
            <Helmet>
                <title>{semester} | Unitastic</title>
                <link rel="canonical" href={`https://unitastic.netlify.app/semesters/${id}`} />
            </Helmet>
            <Navbar />
            { loading ? (
                <div className="container semester-container d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ): (
                <div className="container semester-container">
                    <div className="w-100 d-flex justify-content-center">
                        {/* Unitastic Horizontal Banner */}
                        <ins className="adsbygoogle"
                            style={{ display: "block" }}
                            data-ad-client="ca-pub-7240094938519313"
                            data-ad-slot="1796885446"
                            data-ad-format="auto"
                            data-full-width-responsive="true"></ins>
                    </div>
                    <h3 className="text-center mt-3 mt-md-5">Select Subject</h3>
                    <div className="row gy-2 mt-3">
                        {
                            depts.length > 0 ? (
                                depts.map(dept => (
                                    <div className="col-12 col-md-4 col-lg-3" key={dept.id}>
                                        <div className="card semester-card">
                                            <div className="card-body">
                                                <h5 className="card-title">{dept.name}</h5>
                                                <p className="card-text">{dept.description}</p>
                                                <a href={dept.url} target="_blank" rel="noreferrer" className="btn btn-primary rounded-5">Select</a>
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
                                                <a href={subject.url} target="_blank" rel="noreferrer" className="btn btn-primary rounded-5">Select</a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}

export default Semester
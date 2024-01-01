import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import { getPersonalizedMaterials, getSemesters } from "../../../apis/materials"
import Navbar from "../../../components/Navbar/Navbar"
import Footer from "../../../components/Footer/Footer"
import "./Semesters.css"

const Semesters = () => {
    const [semesters, setSemesters] = useState([])
    const [personalizedMaterials, setPersonalizedMaterials] = useState(null)
    const [loading, setLoading] = useState(true)

    const getSemesterData = async () => {
        const semestersList = await getSemesters()
        const personalizedMaterialsList = await getPersonalizedMaterials()
        setSemesters(semestersList)
        setPersonalizedMaterials(personalizedMaterialsList)
        console.log(personalizedMaterialsList)
        setLoading(false)
    }

    useEffect(() => {
        getSemesterData()
    }, [])

    return (
        <>
            <Helmet>
                <title>Semesters | Unitastic</title>
                <link rel="canonical" href="https://unitastic.netlify.app/semesters" />
            </Helmet>
            <Navbar />
            { loading ? (
                <div className="container semesters-container d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="container semesters-container">
                    { personalizedMaterials ? (
                        <>
                        <h3 className="text-center">Personalized Materials</h3>
                        <div className="row my-3 d-flex justify-content-center">
                            <div className="col-12 col-lg-6">
                                <div className="card semester-card">
                                    <div className="card-body">
                                        <h5 className="card-title">{personalizedMaterials.name}</h5>
                                        <p className="card-text">{personalizedMaterials.semester}</p>
                                        <p className="card-text">{personalizedMaterials.description}</p>
                                        <a href={personalizedMaterials.url} className="btn btn-primary rounded-5" target="_blank" rel="noreferrer">Select</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        </>
                    ) : (
                        <h5 className="text-center mb-3">Login or Signup to get Personalized Materials.</h5>
                    )}
                    <h3 className="text-center">Select Semester</h3>
                    <div className="row gy-2 mt-3">
                        {
                            semesters.map(semester => (
                                <div className="col-12 col-md-4 col-lg-3" key={semester.id}>
                                    <div className="card semester-card">
                                        <div className="card-body">
                                            <h5 className="card-title">{semester.name}</h5>
                                            <p className="card-text">{semester.description}</p>
                                            <Link to={`/semesters/${semester.id}`} className="btn btn-primary rounded-5">Select</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}

export default Semesters
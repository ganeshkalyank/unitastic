import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../main";
import Navbar from "../components/Navbar";
import "./Semesters.css"

const Semesters = () => {
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSemesters = async () => {
        const semestersRef = collection(db, "semesters");
        const q = query(semestersRef, orderBy("name"));
        const semestersSnapshot = await getDocs(q);
        const semestersList = semestersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setSemesters(semestersList);
    }

    useEffect(() => {
        getSemesters();
        setLoading(false);
    }, []);

    return (
        <>
            <Navbar />
                { loading ? (
                    <div className="container semester-container d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="container semesters-container">
                        <h3 className="text-center">Select your Semester</h3>
                        <div className="row gy-2 mt-3">
                            {
                                semesters.map(semester => (
                                    <div className="col-12 col-md-4 col-lg-3" key={semester.id}>
                                        <div className="card semester-card">
                                            <div className="card-body">
                                                <h5 className="card-title">{semester.name}</h5>
                                                <p className="card-text">{semester.description}</p>
                                                <a href={`/semesters/${semester.id}`} className="btn btn-primary rounded-5">Select</a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
        </>
    )
}

export default Semesters
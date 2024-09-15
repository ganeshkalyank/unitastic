import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./CGPACalculator.css";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { Helmet } from "react-helmet-async";
import { calculateCGPA } from "../../../utils/calculators";
import { BASE_URL } from "../../../utils/constants";

const CGPACalculator = () => {
  const [semesters, setSemesters] = useState([]);
  const [cgpa, setCGPA] = useState(0.0);

  const addSemester = () => {
    setSemesters([...semesters, { sgpa: 0.0, credits: 0 }]);
  };

  return (
    <>
      <Helmet>
        <title>CGPA Calculator | Unitastic</title>
        <link rel="canonical" href={BASE_URL + "/cgpa"} />
      </Helmet>
      <Navbar />
      <div className="container cgpa-container">
        <div className="row d-flex justify-content-center p-3">
          <div className="col-lg-6 container shadow bg-white p-3 rounded-3">
            <h4 className="text-center">CGPA Calculator</h4>
            <p>Calculate your CGPA based on SGPA and credits.</p>
            <hr />
            <button className="btn btn-primary rounded-5" onClick={addSemester}>
              Add Semester
            </button>
            {semesters.map((semester, index) => {
              return (
                <div className="row mt-3" key={index}>
                  <div className="col-lg-2">
                    <p className="mt-1">Semester {index + 1}</p>
                  </div>
                  <div className="col-5 col-lg-4 mb-2 mb-lg-0">
                    <input
                      type="number"
                      className="form-control"
                      id={"credits" + index}
                      placeholder="Credits"
                      onChange={(e) => {
                        setSemesters([
                          ...semesters.slice(0, index),
                          {
                            sgpa: semesters[index].sgpa,
                            credits: e.target.value,
                          },
                          ...semesters.slice(index + 1),
                        ]);
                      }}
                    />
                  </div>
                  <div className="col-4 col-lg-4 mb-2 mb-lg-0">
                    <input
                      type="number"
                      className="form-control"
                      id={"sgpa" + index}
                      placeholder="SGPA"
                      onChange={(e) => {
                        setSemesters([
                          ...semesters.slice(0, index),
                          {
                            sgpa: e.target.value,
                            credits: semesters[index].credits,
                          },
                          ...semesters.slice(index + 1),
                        ]);
                      }}
                    />
                  </div>
                  <div className="col-3 col-lg-2">
                    <button
                      className="btn btn-danger d-flex justify-content-center align-items-center rounded-5"
                      onClick={() => {
                        setSemesters([
                          ...semesters.slice(0, index),
                          ...semesters.slice(index + 1),
                        ]);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                </div>
              );
            })}
            <hr />
            <button
              className="btn btn-primary rounded-5"
              onClick={() => setCGPA(calculateCGPA(semesters))}
            >
              Calculate CGPA
            </button>
            <h5 className="text-center mt-3">Your CGPA is {cgpa.toFixed(4)}</h5>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CGPACalculator;

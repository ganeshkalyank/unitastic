import {
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db, auth } from "../../../firebase";

const PersonalDetails = () => {
  const [currentUser, setCurrentUser] = useState({
    displayName: "",
    email: "",
    semester: "",
    department: "",
  });
  const [editing, setEditing] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [resendMailResponse, setResendMailResponse] = useState("");

  const handleEdit = async () => {
    if (editing) {
      setDisabled(true);
      await updateProfile(auth.currentUser, {
        displayName: currentUser.displayName,
      });
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          semester: currentUser.semester,
          department: currentUser.department,
        },
        { merge: true },
      );
      setEditing(false);
      setDisabled(false);
    } else {
      setEditing(true);
    }
  };

  const handleResendConfirmationMail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setResendMailResponse("Confirmation mail sent. Please check your inbox.");
    } catch (error) {
      setResendMailResponse("Error sending confirmation mail.");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          displayName: user.displayName,
          email: user.email,
          semester: "",
          department: "",
          emailVerified: user.emailVerified,
        });
        getDoc(doc(db, "users", user.uid)).then((data) => {
          if (data.exists()) {
            setCurrentUser({
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              semester: data.data().semester,
              department: data.data().department,
            });
          }
        });
      }
    });
  }, []);

  return (
    <div className="personal-details">
      <h3>Personal Details</h3>
      <hr />
      <div className="form-floating mb-3 col-lg-6">
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Name"
          value={currentUser.displayName}
          onChange={(e) =>
            setCurrentUser({ ...currentUser, displayName: e.target.value })
          }
          disabled={!editing}
        />
        <label htmlFor="name">Name</label>
      </div>
      <div className="form-floating mb-3 col-lg-6">
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Email"
          value={currentUser.email}
          disabled
        />
        <label htmlFor="email">Email</label>
      </div>
      <p className="form-text">
        {currentUser.emailVerified ? (
          "Email Verified."
        ) : (
          <>
            Email Not Verified.{" "}
            <a href="#" onClick={handleResendConfirmationMail}>
              Resend confirmation mail
            </a>
            {resendMailResponse}
          </>
        )}
      </p>
      <div className="form-floating mb-3 col-lg-6">
        <select
          className="form-select"
          id="semester"
          aria-label="Semester"
          value={currentUser.semester}
          disabled={!editing}
          onChange={(e) =>
            setCurrentUser({ ...currentUser, semester: e.target.value })
          }
        >
          <option value="">Select</option>
          <option value="Semester 1 & 2">Semester 1 & 2</option>
          <option value="Semester 3">Semester 3</option>
          <option value="Semester 4">Semester 4</option>
          <option value="Semester 5">Semester 5</option>
          <option value="Semester 6">Semester 6</option>
          <option value="Semester 7">Semester 7</option>
          <option value="Semester 8">Semester 8</option>
          <option value="Semester 9">Semester 9</option>
          <option value="Semester 10">Semester 10</option>
        </select>
        <label htmlFor="semester">Semester</label>
      </div>
      <div className="form-floating mb-3 col-lg-6">
        <select
          className="form-select"
          id="department"
          aria-label="Department"
          value={currentUser.department}
          disabled={!editing}
          onChange={(e) =>
            setCurrentUser({ ...currentUser, department: e.target.value })
          }
        >
          <option value="">Select</option>
          <option value="Aerospace Engineering">Aerospace Engineering</option>
          <option value="Bioengineering">Bioengineering</option>
          <option value="Bioinformatics">Bioinformatics</option>
          <option value="Biotechnology">Biotechnology</option>
          <option value="Chemical Engineering">Chemical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Computer Science and Business Systems">
            Computer Science and Business Systems
          </option>
          <option value="Computer Science and Engineering">
            Computer Science and Engineering
          </option>
          <option value="CSE (Artificial Intelligence and Data Science)">
            CSE (Artificial Intelligence and Data Science)
          </option>
          <option value="CSE (Cyber Security and Block Chain Technology)">
            CSE (Cyber Security and Block Chain Technology)
          </option>
          <option value="CSE (IoT and Automation)">
            CSE (IoT and Automation)
          </option>
          <option value="Electrical and Electronics Engineering">
            Electrical and Electronics Engineering
          </option>
          <option value="EEE (Smart Grid and Electric Vehicles)">
            EEE (Smart Grid and Electric Vehicles)
          </option>
          <option value="Electronics and Communications Engineering">
            Electronics and Communications Engineering
          </option>
          <option value="ECE (Cyber Physical Systems)">
            ECE (Cyber Physical Systems)
          </option>
          <option value="Electronics and Instrumentation Engineering">
            Electronics and Instrumentation Engineering
          </option>
          <option value="Robotics and Artificial Intelligence">
            Robotics and Artificial Intelligence
          </option>
          <option value="EEE (VLSI Design and Technology)">
            EEE (VLSI Design and Technology)
          </option>
          <option value="Information and Communication Technology">
            Information and Communication Technology
          </option>
          <option value="Information Technology">Information Technology</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Mechanical Engineering (Digital Manufacturing)">
            Mechanical Engineering (Digital Manufacturing)
          </option>
          <option value="Mechatronics">Mechatronics</option>
        </select>
        <label htmlFor="department">Department</label>
      </div>
      <button
        type="button"
        className="btn btn-primary rounded-5"
        onClick={handleEdit}
        disabled={disabled}
      >
        {editing ? "Save" : "Edit"}
      </button>
    </div>
  );
};

export default PersonalDetails;

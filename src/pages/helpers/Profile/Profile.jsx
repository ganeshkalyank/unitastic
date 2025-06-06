import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import "./Profile.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import PersonalDetails from "../../../components/UserInfo/PersonalDetails/PersonalDetails";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../../../components/UserInfo/ChangePassword/ChangePassword";
import { auth } from "../../../firebase";
import { BASE_URL } from "../../../utils/constants";

const Profile = () => {
  const [tab, setTab] = useState("personal-details");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setTab("logout");
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      // logout error
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
  }, [navigate]);

  return (
    <>
      <title>Profile | Unitastic</title>
      <link rel="canonical" href={BASE_URL + "/profile"} />

      <Navbar />
      <div className="container profile">
        <div className="shadow bg-white rounded-3 p-3">
          <ul className="nav nav-tabs text-center">
            <li className="nav-item">
              <a
                className={`nav-link ${tab === "personal-details" ? "active" : ""}`}
                href="#"
                onClick={() => setTab("personal-details")}
              >
                Personal Details
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${tab === "change-password" ? "active" : ""}`}
                href="#"
                onClick={() => setTab("change-password")}
              >
                Change Password
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${tab === "logout" ? "active" : ""}`}
                href="#"
                onClick={handleLogout}
              >
                Logout
              </a>
            </li>
          </ul>
          <div className="container p-3">
            {tab === "personal-details" && <PersonalDetails />}
            {tab === "change-password" && <ChangePassword />}
            {tab === "logout" && <h3>Logout</h3>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;

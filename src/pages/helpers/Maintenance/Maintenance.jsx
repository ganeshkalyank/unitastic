import { Helmet } from "react-helmet-async";
import notfound from "../../assets/notfound.svg";
import "./Maintenance.css";
import { BASE_URL } from "../../../utils/constants";

const Maintenance = () => {
  return (
    <>
      <Helmet>
        <title>Unitastic</title>
        <link rel="canonical" href={BASE_URL} />
      </Helmet>
      <div className="container maintenance-container">
        <h1 className="maintenance-title text-center">Unitastic</h1>
        <div className="d-flex justify-content-center">
          <img src={notfound} className="maintenance-img" alt="Not Found" />
        </div>
        <h1 className="maintenance-title text-center">Under Maintenance!</h1>
      </div>
    </>
  );
};

export default Maintenance;

import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import "./Loader.css";

const Loader = () => {
  return (
    <>
      <Navbar />
      <div className="container loader-container d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Loader;

import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import "./Credits.css";
import { BASE_URL } from "../../../utils/constants";

const Credits = () => {
  return (
    <>
      <title>Credits | Unitastic</title>
      <link rel="canonical" href={BASE_URL + "/credits"} />

      <Navbar />
      <div className="container credits-container">
        <h3 className="text-center">Credits</h3>
        <div className="row d-flex justify-content-center">
          <div className="col-lg-8">
            <section className="my-3">
              We would like to acknowledge and express our gratitude to the
              following individuals, organizations, and resources that have
              contributed to the development of &quot;Unitastic.&quot;
            </section>
            <section>
              <h5>Development Frameworks and Libraries:</h5>
              <ul>
                <li>
                  <strong>React.js:</strong> We utilized the React.js framework
                  to create the dynamic and responsive user interface of our
                  website.
                </li>
                <li>
                  <strong>Bootstrap:</strong> The Bootstrap framework helped us
                  design and structure our web pages efficiently, ensuring a
                  user-friendly experience.
                </li>
                <li>
                  <strong>Firebase:</strong> We relied on Firebase for data
                  management, authentication, and analytics, enhancing the
                  functionality and security of our services.
                </li>
              </ul>
            </section>
            <section>
              <h5>Icon Resources:</h5>
              <ul>
                <li>
                  <strong>Font Awesome:</strong> We extend our thanks to Font
                  Awesome for providing a comprehensive library of high-quality
                  icons that enhanced the visual elements of our website.
                </li>
              </ul>
            </section>
            <section>
              <h5>Graphic Resources:</h5>
              <ul>
                <li>
                  <strong>Freepik:</strong> We are grateful to Freepik for
                  providing high-quality graphical images and resources that
                  added visual appeal to our website.
                </li>
              </ul>
            </section>
            <section>
              <h5>Feedback and Support:</h5>
              <p>
                Our users have played a vital role in shaping
                &quot;Unitastic.&quot; We appreciate all the feedback,
                suggestions, and support from our user community.
              </p>
            </section>
            <section className="mt-3">
              <p>
                If you have any questions, suggestions, or feedback, please
                don&apos;t hesitate to reach out to us at{" "}
                <a href="mailto:unitastic@outlook.com">unitastic@outlook.com</a>{" "}
                or by filling the feedback form.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Credits;

import { useState } from "react";

const SWIIntegration = () => {
  const [credentials, setCredentials] = useState({
    txtPa: 0,
  });

  return (
    <>
      <div className="swi-integration">
        <h3>SWI Integration</h3>
        {/* <p>
                    SWI Integration is a feature that allows you to integrate your college&apos;s
                    Student Web Interface with Unitastic. This will allow you to view your
                    timetable, attendance, and marks directly from Unitastic.
                </p>
                <hr />
                <p>
                    SWI Integration is currently under development. We will notify you once
                    the feature is available.
                </p> */}
        <div className="form-floating mb-3 col-lg-6">
          <input
            type="text"
            className="form-control"
            id="register_no"
            placeholder="Register Number"
            onChange={(e) =>
              setCredentials({ ...credentials, txtRegNumber: e.target.value })
            }
          />
          <label htmlFor="swi-username">Register Number*</label>
        </div>
        <div className="form-floating mb-3 col-lg-6">
          <input
            type="password"
            className="form-control"
            id="swi-password"
            placeholder="Password"
            onChange={(e) =>
              setCredentials({ ...credentials, txtPwd: e.target.value })
            }
          />
          <label htmlFor="swi-password">Password*</label>
        </div>
        <div className="mb-3 col-lg-6">
          <img
            src="https://webstream.sastra.edu/sastrapwi/stickyImg?1"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            alt="captcha"
          />
        </div>
        <div className="form-floating mb-3 col-lg-6">
          <input
            type="text"
            className="form-control"
            id="swi-captcha"
            placeholder="Captcha"
            onChange={(e) =>
              setCredentials({ ...credentials, name: e.target.value })
            }
          />
          <label htmlFor="swi-captcha">Captcha*</label>
        </div>
        <button type="submit" className="btn btn-primary rounded-5">
          Integrate
        </button>
      </div>
    </>
  );
};

export default SWIIntegration;

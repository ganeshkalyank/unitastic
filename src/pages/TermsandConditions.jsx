import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import "./TermsandConditions.css"

const TermsandConditions = () => {
    return (
        <>
        <Navbar />
        <div className="container terms-container">
            <h3 className="text-center">Terms and Conditions</h3>
            <div className="row d-flex justify-content-center">
                <div className="col-lg-8">
                    <section className="my-3">
                        <p>Last Updated: Sep 4th, 2023</p>
                    </section>
                    <section>
                        <h5>1. Acceptance of Terms</h5>
                        <p>By using the Website, you acknowledge that you have read, understood, and agreed to these T&C. If you are using the Website on behalf of an organization, you are agreeing to these terms for that organization and confirming that you have the authority to do so.</p>
                    </section>
                    <section>
                        <h5>2. User Responsibilities</h5>
                        <p>You agree to use the Website responsibly and in accordance with all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.</p>
                    </section>
                    <section>
                        <h5>3. Privacy Policy</h5>
                        <p>Your use of the Website is also governed by our Privacy Policy, which is incorporated by reference. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.</p>
                    </section>
                    <section>
                        <h5>4. Intellectual Property</h5>
                        <p>All content, trademarks, logos, and other intellectual property on the Website are the property of "Unitastic" and are protected by intellectual property laws. You may not use, reproduce, or distribute any content from the Website without our express written consent.</p>
                    </section>
                    <section>
                        <h5>5. Prohibited Activities</h5>
                        <ul>
                            <li>Spamming or sending unsolicited communications.</li>
                            <li>Hacking or attempting to gain unauthorized access to the Website.</li>
                            <li>Posting or distributing harmful or inappropriate content.</li>
                            <li>Violating any applicable laws or regulations.</li>
                        </ul>
                    </section>
                    <section>
                        <h5>6. Disclaimers</h5>
                        <p>The information and tools provided on the Website are for educational and informational purposes only. We make no guarantees regarding the accuracy or completeness of the information provided. Your use of any information or tools from the Website is at your own risk.</p>
                    </section>
                    <section>
                        <h5>7. Liability Limitations</h5>
                        <p>We are not liable for any damages or losses incurred as a result of your use of the Website. To the extent permitted by applicable laws, we disclaim all warranties, express or implied.</p>
                    </section>
                    <section>
                        <h5>8. Termination of Services</h5>
                        <p>We reserve the right to terminate or suspend your access to the Website at our discretion, with or without cause, and with or without notice.</p>
                    </section>
                    <section>
                        <h5>9. Changes to T&C</h5>
                        <p>We may modify these T&C at any time. Changes will be effective upon posting on the Website. Continued use of the Website after changes indicate your acceptance of the new terms.</p>
                    </section>
                    <section>
                        <h5>10. Governing Law</h5>
                        <p>These T&C are governed by and construed in accordance with the laws of India. Any legal action arising out of or relating to these T&C shall be filed and adjudicated in the courts of India.</p>
                    </section>
                    <section>
                        <h5>11. Contact Information</h5>
                        <p>If you have any questions or concerns about these T&C, please contact us at <a href="mailto:unitastic@outlook.com">unitastic@outlook.com</a>.</p>
                    </section>
                </div>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default TermsandConditions
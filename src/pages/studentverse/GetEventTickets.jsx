import { useEffect, useState } from "react"
import axios from "axios"
import { logEvent } from "firebase/analytics"
import { analytics } from "../../main"
import { teamdcsCredentials } from "../../config"
import "./GetEventTickets.css"
import QRCode from "react-qr-code"

const GetEventTickets = () => {
    const [applno, setApplno] = useState("")
    const [mobile, setMobile] = useState("")
    const [ticketData, setTicketData] = useState([])
    const [response, setResponse] = useState("")

    const getTickets = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.get(`https://corsproxy.io/?https://teamdcs.sastra.edu/eventsapi/api/register/getTickets/${applno}`, {
                auth: {
                    username: teamdcsCredentials.username,
                    password: teamdcsCredentials.password
                }
            });
            if (response.data.user.phoneNumber != mobile) {
                throw new Error("Mobile Number does not match")
            }
            if (response.data.userTickets.length == 0) {
                throw new Error("No Tickets Found")
            }
            setTicketData(response.data.userTickets)
            logEvent(analytics, 'get_event_tickets', response.data)
            setResponse("")
        } catch (error) {
            setTicketData([])
            if (error.message == "Request failed with status code 404") {
                setResponse("No Tickets Found")
            } else {
                setResponse(error.message)
            }
            logEvent(analytics, 'get_event_tickets_error', error.message)
        }
    }

    useEffect(() => {
        document.title = "Get Event Tickets | Unitastic"
    }, [])

    return (
        <>
        {/* <Navbar /> */}
        <div className="container tickets-container">
            <div className="row d-flex justify-content-center p-3">
                <div className="col-lg-6 container shadow bg-white p-3 rounded-3">
                    <h4 className="text-center">Get Event Tickets</h4>
                    <p>Get event tickets from Studentverse App.</p>
                    <hr />
                    <form onSubmit={getTickets}>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="applno" placeholder="." onChange={(e) => setApplno(e.target.value)}/>
                            <label htmlFor="applno">Application Number</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="mobile" placeholder="." onChange={(e) => setMobile(e.target.value)}/>
                            <label htmlFor="mobile">Mobile</label>
                        </div>
                        <button type="submit" className="btn btn-primary mb-3 rounded-5">Get Tickets</button>
                        <div className="response">{response}</div>
                    </form>
                    {
                        ticketData.length > 0 &&
                        <div className="tickets">
                            <hr />
                            <h5 className="text-center mb-3">Ticket</h5>
                            {ticketData.map(ticket => (
                                <div className="ticket" key={ticket._id}>
                                    <div className="ticket-event">{ticket.eventName}</div>
                                    <div className="text-center mb-2">
                                        <QRCode value={ticket.ticketId} size={128} fgColor="#222831"/>
                                    </div>
                                    <div className="ticket-id text-center">{ticket.ticketId}</div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </div>
        {/* <Footer /> */}
        </>
    )
}

export default GetEventTickets
import { useState } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { auth } from '../../../firebase'

const ChangePassword = () => {
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [submitting, setSubmitting] = useState(false)
    const [response, setResponse] = useState("")

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setResponse("")

        if (password.newPassword !== password.confirmPassword) {
            setResponse("Passwords do not match.")
            setSubmitting(false)
            return
        }

        try {
            const userCredential = EmailAuthProvider.credential(auth.currentUser.email, password.oldPassword)
            await reauthenticateWithCredential(auth.currentUser, userCredential)
            await updatePassword(auth.currentUser, password.newPassword)
            setResponse("Password changed successfully.")
            setSubmitting(false)
        } catch (error) {
            if (error.code === "auth/wrong-password") {
                setResponse("Wrong password.")
            } else if (error.code === "auth/weak-password") {
                setResponse("Weak password.")
            } else {
                setResponse("An error occurred. Please try again later.")
            }
            setSubmitting(false)
        }
    }

    return (
        <div className="change-password">
            <h3>Change Password</h3>
            <hr />
            <form onSubmit={handlePasswordChange}>
                <div className="form-floating mb-3 col-lg-6">
                    <input type="password" className="form-control" id="old-password" placeholder="Old Password" onChange={(e) => setPassword({...password, oldPassword: e.target.value})} required />
                    <label htmlFor="old-password">Old Password</label>
                </div>
                <div className="form-floating mb-3 col-lg-6">
                    <input type="password" className="form-control" id="new-password" placeholder="New Password" onChange={(e) => setPassword({...password, newPassword: e.target.value})} required />
                    <label htmlFor="new-password">New Password</label>
                </div>
                <div className="form-floating mb-3 col-lg-6">
                    <input type="password" className="form-control" id="confirm-password" placeholder="Confirm Password" onChange={(e) => setPassword({...password, confirmPassword: e.target.value})} required />
                    <label htmlFor="confirm-password">Confirm Password</label>
                </div>
                <button type="submit" className="btn btn-primary rounded-5" disabled={submitting}>Change Password</button>
                <p className="mt-3">{response}</p>
            </form>
        </div>
    )
}

export default ChangePassword

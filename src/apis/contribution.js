import axios from "axios"
import { logEvent } from "firebase/analytics"
import { analytics } from "../firebase"

const contributionApi = axios.create({
    baseURL: "https://formspree.io",
})

const postContribution = async (contribution) => {
    try {
        const response = await contributionApi.post("/f/xpzgdjwa", contribution)
        if (response.status === 200) {
            logEvent(analytics, 'contribution_submitted', {contribution: contribution})
            return "Thank you for your contribution. We will review it and add it to our database."
        }
    } catch (error) {
        logEvent(analytics, 'contribution_submission_failed', {contribution: contribution})
        return "Oops! Something went wrong. Please try again."
    }
}

const postFeedback = async (feedback) => {
    try {
        const response = await contributionApi.post("/f/xpzgdybl", feedback)
        if (response.status === 200) {
            logEvent(analytics, 'feedback_submitted', {feedback: feedback})
            return "Thank you for your feedback."
        }
    } catch (error) {
        logEvent(analytics, 'feedback_submission_failed', {feedback: feedback})
        return "Oops! Something went wrong. Please try again."
    }
}

export { postContribution, postFeedback }
import { logEvent } from "firebase/analytics"
import { analytics } from "../firebase"

const calculateCanBunk = (credits, bunked) => {
    const canBunk = Math.floor((credits * 16 * 0.2) - bunked)
    logEvent(analytics, 'calculated_attendance', {credits: credits, bunked: bunked, canBunk: canBunk})
    return canBunk
}

const calculateCGPA = (semesters) => {
    let totalCredits = 0
    let totalPoints = 0
    semesters.forEach(semester => {
        totalCredits += parseInt(semester.credits)
        totalPoints += parseInt(semester.credits) * parseFloat(semester.sgpa)
    })
    const cgpa = (totalPoints / totalCredits)
    logEvent(analytics, 'calculated_cgpa', {semesters: semesters, cgpa: cgpa})
    return cgpa
}

const calculateExternals = (internals) => {
    if (internals > 50) {
        const externals = {
            "S": "NA",
            "A+": "NA",
            "A": "NA",
            "B": "NA",
            "C": "NA",
            "D": "NA"
        }
        return externals
    }
    const cutoff = {"S": 91, "A+": 86, "A": 75, "B": 66, "C": 55, "D": 50}
    const externals = {
        "S": (cutoff["S"] - internals) * 2,
        "A+": (cutoff["A+"] - internals) * 2,
        "A": (cutoff["A"] - internals) * 2,
        "B": (cutoff["B"] - internals) * 2,
        "C": (cutoff["C"] - internals) * 2,
        "D": (cutoff["D"] - internals) * 2
    }
    logEvent(analytics, 'calculate_externals', {internals: internals, externals: externals})
    return externals
}

const calculateSGPA = (subjects) => {
    let totalCredits = 0
    let totalPoints = 0
    const grades = {"S": 10, "A+": 9, "A": 8, "B": 7, "C": 6, "D": 5, "F": 0}
    subjects.forEach(subject => {
        totalCredits += parseInt(subject.credits)
        totalPoints += parseInt(subject.credits) * grades[subject.grade]
    })
    const sgpa = (totalPoints / totalCredits)
    logEvent(analytics, 'calculated_sgpa', {subjects: subjects, sgpa: sgpa})
    return sgpa
}

const calculateSGPAForCGPA = (cgpaGoal, currentCredits, pastCredits, currentCGPA) => {
    const x = cgpaGoal*(currentCredits+pastCredits)
    const y = currentCGPA*pastCredits
    const sgpa = ((x-y)/currentCredits)
    logEvent(analytics, 'calculated_sgpa', {cgpaGoal: cgpaGoal, currentCGPA: currentCGPA, currentCredits: currentCredits, pastCredits: pastCredits, sgpa: sgpa})
    return sgpa
}

export { calculateCanBunk, calculateCGPA, calculateExternals, calculateSGPA, calculateSGPAForCGPA }
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"

const getSemesters = async () => {
    const semestersRef = collection(db, "semesters")
    const q = query(semestersRef, orderBy("name"))
    const semestersSnapshot = await getDocs(q)
    const semestersList = semestersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return semestersList
}

export { getSemesters }
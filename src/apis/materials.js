import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const getSemesters = async () => {
  const semestersRef = collection(db, "semesters");
  const q = query(semestersRef, orderBy("name"));
  const semestersSnapshot = await getDocs(q);
  const semestersList = semestersSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return semestersList;
};

const getPersonalizedMaterials = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    if (!user.emailVerified) {
      return {
        name: "Verify your email",
        description:
          "You haven't verified your email. Please verify your email to access your personalized materials.",
        url: "/profile",
      };
    }
    const userData = await getDoc(doc(db, "users", user.uid));
    if (userData.data().semester == "Semester 1 & 2") {
      return {
        name: "All Departments",
        description: "1st year materials for both Group A & Group B",
        url: "/semesters/fE8kQXlfVFbD9SpU25Qt",
        semester: userData.data().semester,
      };
    }
    const semestersRef = collection(db, "semesters");
    const semesterQuery = query(
      semestersRef,
      where("name", "==", userData.data().semester),
    );
    const semesterSnapshot = await getDocs(semesterQuery);
    const departmentRef = collection(
      db,
      "semesters",
      semesterSnapshot.docs[0].id,
      "depts",
    );
    const departmentQuery = query(
      departmentRef,
      where("name", "==", userData.data().department),
    );
    const departmentSnapshot = await getDocs(departmentQuery);
    return {
      ...departmentSnapshot.docs[0].data(),
      semester: userData.data().semester,
    };
  } catch (error) {
    return {
      name: "Materials unvailable.",
      description:
        "You haven't set your department and semester in profile or materials are not available yet. Use the following button to set your department and semester.",
      url: "/profile",
    };
  }
};

export { getSemesters, getPersonalizedMaterials };

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './main.css'
import { firebaseConfig } from './config'
import ExpectedExternals from './pages/ExpectedExternals'
import AttendanceCalculator from './pages/AttendanceCalculator'
import SGPACalculator from './pages/SGPACalculator'
import Home from './pages/Home'
import Semesters from './pages/Semesters'
import Semester from './pages/Semester'
import ContributionForm from './pages/ContributionForm'

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

logEvent(analytics, 'root_opened')

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/semesters', element: <Semesters />},
  { path: '/semesters/:id', element: <Semester />},
  { path: '/externals', element: <ExpectedExternals /> },
  { path: '/attendance', element: <AttendanceCalculator /> },
  { path: '/sgpa', element: <SGPACalculator /> },
  { path: '/contribute', element: <ContributionForm /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

export { analytics, db }

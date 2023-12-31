import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './main.css'
import ExpectedExternals from './pages/utilities/ExpectedExternals/ExpectedExternals'
import AttendanceCalculator from './pages/utilities/AttendanceCalculator/AttendanceCalculator'
import SGPACalculator from './pages/utilities/SGPACalculator/SGPACalculator'
import CGPACalculator from './pages/utilities/CGPACalculator/CGPACalculator'
import Home from './pages/Home'
import Semesters from './pages/materials/Semesters/Semesters'
import Semester from './pages/materials/Semester/Semester'
import ContributionForm from './pages/forms/ContributionForm/ContributionForm'
import FeedbackForm from './pages/forms/FeedbackForm/FeedbackForm'
import PageNotFound from './pages/helpers/PageNotFound/PageNotFound'
import Credits from './pages/info/Credits/Credits'
import TermsandConditions from './pages/info/TermsandConditions/TermsandConditions'
import SGPAforCGPA from './pages/utilities/SGPAforCGPA/SGPAforCGPA'
import { logEvent } from 'firebase/analytics'
import { analytics } from './firebase'
import LoginForm from './pages/forms/LoginForm/LoginForm'
import SignupForm from './pages/forms/SignupForm/SignupForm'
import Profile from './pages/helpers/Profile/Profile'

logEvent(analytics, 'root_opened')

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/semesters', element: <Semesters />},
  { path: '/semesters/:id', element: <Semester />},
  { path: '/externals', element: <ExpectedExternals /> },
  { path: '/attendance', element: <AttendanceCalculator /> },
  { path: '/sgpa', element: <SGPACalculator /> },
  { path: '/cgpa', element: <CGPACalculator /> },
  { path: '/targetcgpa', element: <SGPAforCGPA /> },
  { path: '/contribute', element: <ContributionForm /> },
  { path: '/feedback', element: <FeedbackForm /> },
  { path: '/credits', element: <Credits /> },
  { path: '/terms', element: <TermsandConditions /> },
  { path: '/login', element: <LoginForm /> },
  { path: '/signup', element: <SignupForm /> },
  { path: '/profile', element: <Profile /> },
  { path: '*', element: <PageNotFound /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

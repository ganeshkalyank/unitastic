import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SuspenseWrapper from "./components/SuspenseWrapper/SuspenseWrapper";
import { lazy } from "react";
import Loader from "./components/Loader/Loader";

const Home = lazy(() => import("./pages/Home"));
const Semesters = lazy(() => import("./pages/materials/Semesters/Semesters"));
const Semester = lazy(() => import("./pages/materials/Semester/Semester"));
const ExpectedExternals = lazy(
  () => import("./pages/utilities/ExpectedExternals/ExpectedExternals"),
);
const AttendanceCalculator = lazy(
  () => import("./pages/utilities/AttendanceCalculator/AttendanceCalculator"),
);
const SGPACalculator = lazy(
  () => import("./pages/utilities/SGPACalculator/SGPACalculator"),
);
const CGPACalculator = lazy(
  () => import("./pages/utilities/CGPACalculator/CGPACalculator"),
);
const ContributionForm = lazy(
  () => import("./pages/forms/ContributionForm/ContributionForm"),
);

const FeedbackForm = lazy(
  () => import("./pages/forms/FeedbackForm/FeedbackForm"),
);
const PageNotFound = lazy(
  () => import("./pages/helpers/PageNotFound/PageNotFound"),
);
const Credits = lazy(() => import("./pages/info/Credits/Credits"));
const TermsandConditions = lazy(
  () => import("./pages/info/TermsandConditions/TermsandConditions"),
);
const SGPAforCGPA = lazy(
  () => import("./pages/utilities/SGPAforCGPA/SGPAforCGPA"),
);
const LoginForm = lazy(() => import("./pages/forms/LoginForm/LoginForm"));
const SignupForm = lazy(() => import("./pages/forms/SignupForm/SignupForm"));
const Profile = lazy(() => import("./pages/helpers/Profile/Profile"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SuspenseWrapper>
        <Home />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/semesters",
    element: (
      <SuspenseWrapper>
        <Semesters />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/semesters/:id",
    element: (
      <SuspenseWrapper>
        <Semester />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/externals",
    element: (
      <SuspenseWrapper>
        <ExpectedExternals />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/attendance",
    element: (
      <SuspenseWrapper>
        <AttendanceCalculator />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/sgpa",
    element: (
      <SuspenseWrapper>
        <SGPACalculator />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/cgpa",
    element: (
      <SuspenseWrapper>
        <CGPACalculator />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/targetcgpa",
    element: (
      <SuspenseWrapper>
        <SGPAforCGPA />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/contribute",
    element: (
      <SuspenseWrapper>
        <ContributionForm />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/feedback",
    element: (
      <SuspenseWrapper>
        <FeedbackForm />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/credits",
    element: (
      <SuspenseWrapper>
        <Credits />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/terms",
    element: (
      <SuspenseWrapper>
        <TermsandConditions />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginForm />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/signup",
    element: (
      <SuspenseWrapper>
        <SignupForm />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/profile",
    element: (
      <SuspenseWrapper>
        <Profile />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/loading",
    element: <Loader />,
  },
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <PageNotFound />
      </SuspenseWrapper>
    ),
  },
]);

const App = () => {
  return (
    <>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </>
  );
};

export default App;

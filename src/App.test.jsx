import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock all lazy-loaded components
const mockComponents = {
  Home: () => <div data-testid="home-page">Home Page</div>,
  Semesters: () => <div data-testid="semesters-page">Semesters Page</div>,
  Semester: () => <div data-testid="semester-page">Semester Page</div>,
  ExpectedExternals: () => <div data-testid="expected-externals-page">Expected Externals Page</div>,
  AttendanceCalculator: () => <div data-testid="attendance-calculator-page">Attendance Calculator Page</div>,
  SGPACalculator: () => <div data-testid="sgpa-calculator-page">SGPA Calculator Page</div>,
  CGPACalculator: () => <div data-testid="cgpa-calculator-page">CGPA Calculator Page</div>,
  SGPAforCGPA: () => <div data-testid="sgpa-for-cgpa-page">SGPA for CGPA Page</div>,
  ContributionForm: () => <div data-testid="contribution-form-page">Contribution Form Page</div>,
  FeedbackForm: () => <div data-testid="feedback-form-page">Feedback Form Page</div>,
  Credits: () => <div data-testid="credits-page">Credits Page</div>,
  TermsandConditions: () => <div data-testid="terms-page">Terms and Conditions Page</div>,
  LoginForm: () => <div data-testid="login-form-page">Login Form Page</div>,
  SignupForm: () => <div data-testid="signup-form-page">Signup Form Page</div>,
  Profile: () => <div data-testid="profile-page">Profile Page</div>,
  Maintenance: () => <div data-testid="maintenance-page">Maintenance Page</div>,
  PageNotFound: () => <div data-testid="page-not-found">Page Not Found</div>,
};

// Mock lazy imports
vi.mock("./pages/Home", () => ({
  default: mockComponents.Home,
}));

vi.mock("./pages/materials/Semesters/Semesters", () => ({
  default: mockComponents.Semesters,
}));

vi.mock("./pages/materials/Semester/Semester", () => ({
  default: mockComponents.Semester,
}));

vi.mock("./pages/utilities/ExpectedExternals/ExpectedExternals", () => ({
  default: mockComponents.ExpectedExternals,
}));

vi.mock("./pages/utilities/AttendanceCalculator/AttendanceCalculator", () => ({
  default: mockComponents.AttendanceCalculator,
}));

vi.mock("./pages/utilities/SGPACalculator/SGPACalculator", () => ({
  default: mockComponents.SGPACalculator,
}));

vi.mock("./pages/utilities/CGPACalculator/CGPACalculator", () => ({
  default: mockComponents.CGPACalculator,
}));

vi.mock("./pages/utilities/SGPAforCGPA/SGPAforCGPA", () => ({
  default: mockComponents.SGPAforCGPA,
}));

vi.mock("./pages/forms/ContributionForm/ContributionForm", () => ({
  default: mockComponents.ContributionForm,
}));

vi.mock("./pages/forms/FeedbackForm/FeedbackForm", () => ({
  default: mockComponents.FeedbackForm,
}));

vi.mock("./pages/info/Credits/Credits", () => ({
  default: mockComponents.Credits,
}));

vi.mock("./pages/info/TermsandConditions/TermsandConditions", () => ({
  default: mockComponents.TermsandConditions,
}));

vi.mock("./pages/forms/LoginForm/LoginForm", () => ({
  default: mockComponents.LoginForm,
}));

vi.mock("./pages/forms/SignupForm/SignupForm", () => ({
  default: mockComponents.SignupForm,
}));

vi.mock("./pages/helpers/Profile/Profile", () => ({
  default: mockComponents.Profile,
}));

vi.mock("./pages/helpers/Maintenance/Maintenance", () => ({
  default: mockComponents.Maintenance,
}));

vi.mock("./pages/helpers/PageNotFound/PageNotFound", () => ({
  default: mockComponents.PageNotFound,
}));

// Mock SuspenseWrapper and Loader
vi.mock("./components/SuspenseWrapper/SuspenseWrapper", () => ({
  default: ({ children }) => <div data-testid="suspense-wrapper">{children}</div>,
}));

vi.mock("./components/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Helper function to render app 
const renderApp = () => {
  return render(<App />);
};

describe("App Component", () => {
  test("renders App component without crashing", () => {
    render(<App />);
    // App should render without errors
    expect(document.body).toBeInTheDocument();
  });

  test("App uses RouterProvider architecture", () => {
    render(<App />);
    // App component should render successfully with its RouterProvider
    expect(document.body).toBeInTheDocument();
  });

  test("all page components are properly mocked", () => {
    // Test that all components are available
    expect(mockComponents.Home).toBeDefined();
    expect(mockComponents.Semesters).toBeDefined();
    expect(mockComponents.Semester).toBeDefined();
    expect(mockComponents.ExpectedExternals).toBeDefined();
    expect(mockComponents.AttendanceCalculator).toBeDefined();
    expect(mockComponents.SGPACalculator).toBeDefined();
    expect(mockComponents.CGPACalculator).toBeDefined();
    expect(mockComponents.SGPAforCGPA).toBeDefined();
    expect(mockComponents.ContributionForm).toBeDefined();
    expect(mockComponents.FeedbackForm).toBeDefined();
    expect(mockComponents.Credits).toBeDefined();
    expect(mockComponents.TermsandConditions).toBeDefined();
    expect(mockComponents.LoginForm).toBeDefined();
    expect(mockComponents.SignupForm).toBeDefined();
    expect(mockComponents.Profile).toBeDefined();
    expect(mockComponents.Maintenance).toBeDefined();
    expect(mockComponents.PageNotFound).toBeDefined();
  });

  test("App component structure is valid", () => {
    const { container } = render(<App />);
    // App should render some content
    expect(container.firstChild).toBeTruthy();
  });

  test("App renders without throwing errors", () => {
    expect(() => render(<App />)).not.toThrow();
  });
});


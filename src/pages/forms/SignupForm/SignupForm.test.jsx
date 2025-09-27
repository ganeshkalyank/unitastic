import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import SignupForm from "./SignupForm";

// Mock Firebase
vi.mock("../../../firebase", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  sendEmailVerification: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";

// Wrapper component for React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("SignupForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); // No user logged in by default
    });
  });

  test("renders signup form with all elements", () => {
    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    expect(screen.getByRole("heading", { name: "Signup" })).toBeInTheDocument();
    expect(screen.getByText("Signup to receive personalised content and access member-only features.")).toBeInTheDocument();
    expect(screen.getByLabelText("Name*")).toBeInTheDocument();
    expect(screen.getByLabelText("Email*")).toBeInTheDocument();
    expect(screen.getByLabelText("Password*")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Signup" })).toBeInTheDocument();
  });

  test("handles form input changes", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    const nameInput = screen.getByLabelText("Name*");
    const emailInput = screen.getByLabelText("Email*");
    const passwordInput = screen.getByLabelText("Password*");

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("handles successful signup", async () => {
    const user = userEvent.setup();
    const mockUser = { uid: "user123", email: "john@example.com" };
    const mockUserCredential = { user: mockUser };

    createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
    updateProfile.mockResolvedValue();
    sendEmailVerification.mockResolvedValue();

    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("Name*"), "John Doe");
    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Password*"), "password123");
    
    const signupButton = screen.getByRole("button", { name: "Signup" });
    await user.click(signupButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "john@example.com",
        "password123"
      );
      expect(updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: "John Doe",
      });
      expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
      expect(screen.getByText("Signup successful. Please check your inbox for verification email.")).toBeInTheDocument();
    });
  });

  test("handles signup errors", async () => {
    const user = userEvent.setup();
    
    const errorCases = [
      { code: "auth/email-already-in-use", message: "Email already in use." },
      { code: "auth/invalid-email", message: "Invalid email." },
      { code: "auth/weak-password", message: "Weak password." },
      { code: "auth/unknown-error", message: "An error occurred. Please try again later." },
    ];

    for (const errorCase of errorCases) {
      vi.clearAllMocks();
      createUserWithEmailAndPassword.mockRejectedValue({ code: errorCase.code });

      const { container } = render(
        <RouterWrapper>
          <SignupForm />
        </RouterWrapper>
      );

      await user.type(screen.getByLabelText("Name*"), "John Doe");
      await user.type(screen.getByLabelText("Email*"), "john@example.com");
      await user.type(screen.getByLabelText("Password*"), "password123");
      
      const signupButton = screen.getByRole("button", { name: "Signup" });
      await user.click(signupButton);

      await waitFor(() => {
        expect(screen.getByText(errorCase.message)).toBeInTheDocument();
      });

      // Clean up for next iteration
      container.remove();
    }
  });

  test("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    createUserWithEmailAndPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("Name*"), "John Doe");
    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Password*"), "password123");
    
    const signupButton = screen.getByRole("button", { name: "Signup" });
    await user.click(signupButton);

    expect(signupButton).toBeDisabled();
  });

  test("redirects logged-in user to semesters", () => {
    const mockUser = { uid: "user123", email: "test@example.com" };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
    });

    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/semesters");
  });

  test("renders login link", () => {
    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    const loginLinks = screen.getAllByText("Login");
    const footerLoginLink = loginLinks.find(link => 
      link.closest("p")?.textContent?.includes("Already have an account?")
    );
    expect(footerLoginLink).toBeInTheDocument();
    expect(footerLoginLink.closest("a")).toHaveAttribute("href", "/login");
  });

  test("requires all fields to be filled", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    const signupButton = screen.getByRole("button", { name: "Signup" });
    
    // Try to submit without filling fields
    await user.click(signupButton);

    // Check that required fields are marked as required
    expect(screen.getByLabelText("Name*")).toBeRequired();
    expect(screen.getByLabelText("Email*")).toBeRequired();
    expect(screen.getByLabelText("Password*")).toBeRequired();
  });

  test("handles profile update error gracefully", async () => {
    const user = userEvent.setup();
    const mockUser = { uid: "user123", email: "john@example.com" };
    const mockUserCredential = { user: mockUser };

    createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
    updateProfile.mockRejectedValue(new Error("Profile update failed"));
    sendEmailVerification.mockResolvedValue();

    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("Name*"), "John Doe");
    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Password*"), "password123");
    
    const signupButton = screen.getByRole("button", { name: "Signup" });
    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText("An error occurred. Please try again later.")).toBeInTheDocument();
    });
  });

  test("handles email verification error gracefully", async () => {
    const user = userEvent.setup();
    const mockUser = { uid: "user123", email: "john@example.com" };
    const mockUserCredential = { user: mockUser };

    createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
    updateProfile.mockResolvedValue();
    sendEmailVerification.mockRejectedValue(new Error("Email verification failed"));

    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("Name*"), "John Doe");
    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Password*"), "password123");
    
    const signupButton = screen.getByRole("button", { name: "Signup" });
    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText("An error occurred. Please try again later.")).toBeInTheDocument();
    });
  });

  test("has correct page title and canonical link", () => {
    render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    expect(document.title).toBe("Signup | Unitastic");
    
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/signup");
  });

  test("form has correct HTML structure", () => {
    const { container } = render(
      <RouterWrapper>
        <SignupForm />
      </RouterWrapper>
    );

    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    
    // Check for floating labels
    expect(container.querySelector(".form-floating")).toBeInTheDocument();
    
    // Check that form has required inputs
    expect(screen.getByLabelText("Name*")).toBeRequired();
    expect(screen.getByLabelText("Email*")).toBeRequired();
    expect(screen.getByLabelText("Password*")).toBeRequired();
  });
});
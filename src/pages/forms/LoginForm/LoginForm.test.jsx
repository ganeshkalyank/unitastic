import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "./LoginForm";

// Mock Firebase
vi.mock("../../../firebase", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  onAuthStateChanged: vi.fn(),
  GoogleAuthProvider: vi.fn(),
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
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";

// Wrapper component for React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("LoginForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); // No user logged in by default
    });
  });

  test("renders login form with all elements", () => {
    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByText("Login to receive personalised content and access member-only features.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email*")).toBeInTheDocument();
    expect(screen.getByLabelText("Password*")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login with Google/ })).toBeInTheDocument();
  });

  test("handles form input changes", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText("Email*");
    const passwordInput = screen.getByLabelText("Password*");

    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("john@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("handles successful login", async () => {
    const user = userEvent.setup();
    const mockUser = { uid: "user123", email: "john@example.com" };
    const mockUserCredential = { user: mockUser };

    signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Password*"), "password123");
    
    const loginButton = screen.getByRole("button", { name: "Login" });
    await user.click(loginButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "john@example.com",
        "password123"
      );
      expect(screen.getByText("Login successful.")).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  test("handles login errors", async () => {
    const user = userEvent.setup();
    
    const errorCases = [
      { code: "auth/invalid-email", message: "Invalid email." },
      { code: "auth/user-disabled", message: "User disabled. Please contact support." },
      { code: "auth/user-not-found", message: "Invalid email or password." },
      { code: "auth/wrong-password", message: "Invalid email or password." },
      { code: "auth/unknown-error", message: "An error occurred. Please try again later." },
    ];

    for (const errorCase of errorCases) {
      vi.clearAllMocks();
      signInWithEmailAndPassword.mockRejectedValue({ code: errorCase.code });

      const { container } = render(
        <RouterWrapper>
          <LoginForm />
        </RouterWrapper>
      );

      await user.type(screen.getByLabelText("Email*"), "john@example.com");
      await user.type(screen.getByLabelText("Password*"), "password123");
      
      const loginButton = screen.getByRole("button", { name: "Login" });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(errorCase.message)).toBeInTheDocument();
      });

      // Clean up for next iteration
      container.remove();
    }
  });

  test("handles Google login", async () => {
    const user = userEvent.setup();
    const mockUser = { uid: "user123", email: "john@example.com" };
    const mockUserCredential = { user: mockUser };

    signInWithPopup.mockResolvedValue(mockUserCredential);

    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    const googleLoginButton = screen.getByRole("button", { name: /Login with Google/ });
    await user.click(googleLoginButton);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(screen.getByText("Login successful.")).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  test("handles Google login error", async () => {
    const user = userEvent.setup();
    
    signInWithPopup.mockRejectedValue(new Error("Google login failed"));

    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    const googleLoginButton = screen.getByRole("button", { name: /Login with Google/ });
    await user.click(googleLoginButton);

    await waitFor(() => {
      expect(screen.getByText("An error occurred. Please try again later.")).toBeInTheDocument();
    });
  });

  test("handles forgot password", async () => {
    const user = userEvent.setup();
    
    sendPasswordResetEmail.mockResolvedValue();

    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    
    const forgotPasswordLink = screen.getByText("Forgot Password?");
    await user.click(forgotPasswordLink);

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, "john@example.com");
      expect(screen.getByText("Password reset email sent. Please check your inbox.")).toBeInTheDocument();
    });
  });

  test("handles forgot password without email", async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    const forgotPasswordLink = screen.getByText("Forgot Password?");
    await user.click(forgotPasswordLink);

    await waitFor(() => {
      expect(screen.getByText("Please enter your email.")).toBeInTheDocument();
    });
  });

  test("handles forgot password error", async () => {
    const user = userEvent.setup();
    
    sendPasswordResetEmail.mockRejectedValue(new Error("Reset email failed"));

    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    
    const forgotPasswordLink = screen.getByText("Forgot Password?");
    await user.click(forgotPasswordLink);

    await waitFor(() => {
      expect(screen.getByText("Error sending password reset email.")).toBeInTheDocument();
    });
  });

  test("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Password*"), "password123");
    
    const loginButton = screen.getByRole("button", { name: "Login" });
    await user.click(loginButton);

    expect(loginButton).toBeDisabled();
  });

  test("redirects logged-in user to profile", () => {
    const mockUser = { uid: "user123", email: "test@example.com" };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
    });

    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  test("renders signup link", () => {
    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    const signupLink = screen.getByText("Signup");
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest("a")).toHaveAttribute("href", "/signup");
  });

  test("requires all fields to be filled", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    const loginButton = screen.getByRole("button", { name: "Login" });
    
    // Try to submit without filling fields
    await user.click(loginButton);

    // Check that required fields are marked as required
    expect(screen.getByLabelText("Email*")).toBeRequired();
    expect(screen.getByLabelText("Password*")).toBeRequired();
  });

  test("has correct page title and canonical link", () => {
    render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    expect(document.title).toBe("Login | Unitastic");
    
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/login");
  });

  test("form has correct HTML structure", () => {
    const { container } = render(
      <RouterWrapper>
        <LoginForm />
      </RouterWrapper>
    );

    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    
    // Check for floating labels
    expect(container.querySelector(".form-floating")).toBeInTheDocument();
    
    // Check that form has required inputs
    expect(screen.getByLabelText("Email*")).toBeRequired();
    expect(screen.getByLabelText("Password*")).toBeRequired();
  });
});
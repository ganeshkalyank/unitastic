import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";

// Mock Firebase
vi.mock("../../firebase", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

import { onAuthStateChanged } from "firebase/auth";

// Wrapper component for React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders navbar with brand name", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); // No user logged in
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    expect(screen.getByText("Unitastic")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("shows Login link when user is not logged in", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); // No user logged in
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  test("shows Profile link when user is logged in", () => {
    const mockUser = { uid: "user123", email: "test@example.com" };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser); // User logged in
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("renders all navigation links", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    expect(screen.getAllByText("Materials")).toHaveLength(2); // Nav link and dropdown item
    expect(screen.getByText("Utilities")).toBeInTheDocument();
    expect(screen.getByText("Useful Links")).toBeInTheDocument();
    expect(screen.getByText("Archives")).toBeInTheDocument();
    expect(screen.getByText("Contribute")).toBeInTheDocument();
  });

  test("renders utility dropdown links", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    expect(screen.getByText("SGPA Calculator")).toBeInTheDocument();
    expect(screen.getByText("CGPA Calculator")).toBeInTheDocument();
    expect(screen.getByText("Required SGPA")).toBeInTheDocument();
    expect(screen.getByText("Expected Externals")).toBeInTheDocument();
    expect(screen.getByText("Class Skippability")).toBeInTheDocument();
  });

  test("renders useful links with correct attributes", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    const studentWebLink = screen.getByText("Student Web Interface");
    expect(studentWebLink).toHaveAttribute("href", "https://webstream.sastra.edu/sastrapwi/");
    expect(studentWebLink).toHaveAttribute("target", "_blank");
    expect(studentWebLink).toHaveAttribute("rel", "noreferrer");

    const parentWebLink = screen.getByText("Parent Web Interface");
    expect(parentWebLink).toHaveAttribute("href", "https://webstream.sastra.edu/sastraparentweb/");

    const hostelLeaveLink = screen.getByText("Hostel Leave Portal");
    expect(hostelLeaveLink).toHaveAttribute("href", "https://biometric.sastra.edu/");
  });

  test("renders contribute dropdown links", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    expect(screen.getAllByText("Materials")).toHaveLength(2); // Nav link and dropdown item
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    
    const buyMeCoffeeLink = screen.getByText("Buy me a coffee");
    expect(buyMeCoffeeLink).toHaveAttribute("href", "https://buymeacoffee.com/xoidykilr");
    expect(buyMeCoffeeLink).toHaveAttribute("target", "_blank");
  });

  test("has mobile-responsive toggle button", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    const toggleButton = document.querySelector(".navbar-toggler");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("data-bs-toggle", "collapse");
    expect(toggleButton).toHaveAttribute("data-bs-target", "#navbarContent");
  });

  test("handles auth state changes correctly", () => {
    const mockCallback = vi.fn();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      mockCallback.mockImplementation(callback);
      return () => {}; // Cleanup function
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();
  });

  test("brand link navigates to home", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    const brandLink = screen.getByText("Unitastic").closest("a");
    expect(brandLink).toHaveAttribute("href", "/");
  });

  test("materials link navigates to semesters page", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    const materialsLinks = screen.getAllByText("Materials");
    const navMaterialsLink = materialsLinks.find(link => link.closest('a').getAttribute('href') === '/semesters');
    expect(navMaterialsLink.closest("a")).toHaveAttribute("href", "/semesters");
  });
});
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import ContributionForm from "./ContributionForm";

// Mock the API
vi.mock("../../../apis/contribution", () => ({
  postContribution: vi.fn(),
}));

import { postContribution } from "../../../apis/contribution";

// Wrapper component for React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("ContributionForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders contribution form with all elements", () => {
    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    expect(screen.getByRole("heading", { name: "Contribute" })).toBeInTheDocument();
    expect(screen.getByText("Contribute to Unitastic by adding any missing materials, previous question papers, textbooks or presentations.")).toBeInTheDocument();
    
    expect(screen.getByLabelText("Name*")).toBeInTheDocument();
    expect(screen.getByLabelText("Email*")).toBeInTheDocument();
    expect(screen.getByLabelText("Semester*")).toBeInTheDocument();
    expect(screen.getByLabelText("Department*")).toBeInTheDocument();
    expect(screen.getByLabelText("Course*")).toBeInTheDocument();
    expect(screen.getByLabelText("Drive URL*")).toBeInTheDocument();
    expect(screen.getByLabelText("Additional Info (if any)")).toBeInTheDocument();
    
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  test("handles form input changes", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    const nameInput = screen.getByLabelText("Name*");
    const emailInput = screen.getByLabelText("Email*");
    const semesterInput = screen.getByLabelText("Semester*");
    const departmentInput = screen.getByLabelText("Department*");
    const courseInput = screen.getByLabelText("Course*");
    const driveUrlInput = screen.getByLabelText("Drive URL*");
    const infoInput = screen.getByLabelText("Additional Info (if any)");

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(semesterInput, "Semester 5");
    await user.type(departmentInput, "Computer Science");
    await user.type(courseInput, "Data Structures");
    await user.type(driveUrlInput, "https://drive.google.com/test");
    await user.type(infoInput, "Additional information");

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(semesterInput).toHaveValue("Semester 5");
    expect(departmentInput).toHaveValue("Computer Science");
    expect(courseInput).toHaveValue("Data Structures");
    expect(driveUrlInput).toHaveValue("https://drive.google.com/test");
    expect(infoInput).toHaveValue("Additional information");
  });

  test("handles successful form submission", async () => {
    const user = userEvent.setup();
    postContribution.mockResolvedValue("Thank you for your contribution. We will review it and add it to our database.");

    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    // Fill out the form
    await user.type(screen.getByLabelText("Name*"), "John Doe");
    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Semester*"), "Semester 5");
    await user.type(screen.getByLabelText("Department*"), "Computer Science");
    await user.type(screen.getByLabelText("Course*"), "Data Structures");
    await user.type(screen.getByLabelText("Drive URL*"), "https://drive.google.com/test");
    await user.type(screen.getByLabelText("Additional Info (if any)"), "Additional info");
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(postContribution).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        semester: "Semester 5",
        department: "Computer Science",
        course: "Data Structures",
        driveurl: "https://drive.google.com/test",
        info: "Additional info",
      });
      expect(screen.getByText("Thank you for your contribution. We will review it and add it to our database.")).toBeInTheDocument();
    });
  });

  test("handles form submission error", async () => {
    const user = userEvent.setup();
    postContribution.mockResolvedValue("Oops! Something went wrong. Please try again.");

    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    // Fill out required fields
    await user.type(screen.getByLabelText("Name*"), "John Doe");
    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Semester*"), "Semester 5");
    await user.type(screen.getByLabelText("Department*"), "Computer Science");
    await user.type(screen.getByLabelText("Course*"), "Data Structures");
    await user.type(screen.getByLabelText("Drive URL*"), "https://drive.google.com/test");
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Oops! Something went wrong. Please try again.")).toBeInTheDocument();
    });
  });

  test("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    postContribution.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve("Success"), 100))
    );

    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    // Fill out required fields
    await user.type(screen.getByLabelText("Name*"), "John Doe");
    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Semester*"), "Semester 5");
    await user.type(screen.getByLabelText("Department*"), "Computer Science");
    await user.type(screen.getByLabelText("Course*"), "Data Structures");
    await user.type(screen.getByLabelText("Drive URL*"), "https://drive.google.com/test");
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    expect(screen.getByText("Submitting...")).toBeInTheDocument();
    expect(submitButton).toHaveClass("disabled");
  });

  test("requires all mandatory fields", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    const submitButton = screen.getByRole("button", { name: "Submit" });
    
    // Try to submit without filling fields
    await user.click(submitButton);

    // Check that required fields are marked as required
    expect(screen.getByLabelText("Name*")).toBeRequired();
    expect(screen.getByLabelText("Email*")).toBeRequired();
    expect(screen.getByLabelText("Semester*")).toBeRequired();
    expect(screen.getByLabelText("Department*")).toBeRequired();
    expect(screen.getByLabelText("Course*")).toBeRequired();
    expect(screen.getByLabelText("Drive URL*")).toBeRequired();
    
    // Additional info should not be required
    expect(screen.getByLabelText("Additional Info (if any)")).not.toBeRequired();
  });

  test("handles submission without optional fields", async () => {
    const user = userEvent.setup();
    postContribution.mockResolvedValue("Success");

    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    // Fill out only required fields
    await user.type(screen.getByLabelText("Name*"), "John Doe");
    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.type(screen.getByLabelText("Semester*"), "Semester 5");
    await user.type(screen.getByLabelText("Department*"), "Computer Science");
    await user.type(screen.getByLabelText("Course*"), "Data Structures");
    await user.type(screen.getByLabelText("Drive URL*"), "https://drive.google.com/test");
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(postContribution).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        semester: "Semester 5",
        department: "Computer Science",
        course: "Data Structures",
        driveurl: "https://drive.google.com/test",
        info: undefined, // Optional field not filled
      });
    });
  });

  test("shows mandatory field indicator", () => {
    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    expect(screen.getByText("* Fields marked with an asterisk are mandatory.")).toBeInTheDocument();
  });

  test("has correct page title and canonical link", () => {
    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    expect(document.title).toBe("Contribute | Unitastic");
    
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/contribute");
  });

  test("form has correct HTML structure", () => {
    const { container } = render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    
    // Check for floating labels
    expect(document.querySelectorAll(".form-floating")).toHaveLength(7); // 7 form fields
    
    // Check for shadow container
    expect(document.querySelector(".shadow")).toBeInTheDocument();
  });

  test("email field accepts valid email format", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <ContributionForm />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText("Email*");
    expect(emailInput).toHaveAttribute("type", "email");
    
    await user.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");
  });
});
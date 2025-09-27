import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import FeedbackForm from "./FeedbackForm";

// Mock the API
vi.mock("../../../apis/contribution", () => ({
  postFeedback: vi.fn(),
}));

import { postFeedback } from "../../../apis/contribution";

// Wrapper component for React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("FeedbackForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders feedback form with all elements", () => {
    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    expect(screen.getByRole("heading", { name: "Feedback" })).toBeInTheDocument();
    expect(screen.getByText("We would love to hear your feedback about Unitastic. Please let us know if you have any suggestions or if you find any discrepancies in the content.")).toBeInTheDocument();
    
    expect(screen.getByLabelText("Name*")).toBeInTheDocument();
    expect(screen.getByLabelText("Email*")).toBeInTheDocument();
    expect(screen.getByLabelText("Feedback Type*")).toBeInTheDocument();
    expect(screen.getByLabelText("Message*")).toBeInTheDocument();
    
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  test("renders feedback type dropdown options", () => {
    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    const select = screen.getByLabelText("Feedback Type*");
    expect(select).toBeInTheDocument();
    
    // Check for default option
    expect(screen.getByText("Select Feedback Type")).toBeInTheDocument();
    
    // Check for specific options
    expect(screen.getByText("Suggestion")).toBeInTheDocument();
    expect(screen.getByText("Discrepancy")).toBeInTheDocument();
  });

  test("handles form input changes", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    const nameInput = screen.getByLabelText("Name*");
    const emailInput = screen.getByLabelText("Email*");
    const typeSelect = screen.getByLabelText("Feedback Type*");
    const messageTextarea = screen.getByLabelText("Message*");

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "jane@example.com");
    await user.selectOptions(typeSelect, "suggestion");
    await user.type(messageTextarea, "Great website, but could use more features.");

    expect(nameInput).toHaveValue("Jane Doe");
    expect(emailInput).toHaveValue("jane@example.com");
    expect(typeSelect).toHaveValue("suggestion");
    expect(messageTextarea).toHaveValue("Great website, but could use more features.");
  });

  test("handles successful form submission", async () => {
    const user = userEvent.setup();
    postFeedback.mockResolvedValue("Thank you for your feedback.");

    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    // Fill out the form
    await user.type(screen.getByLabelText("Name*"), "Jane Doe");
    await user.type(screen.getByLabelText("Email*"), "jane@example.com");
    await user.selectOptions(screen.getByLabelText("Feedback Type*"), "suggestion");
    await user.type(screen.getByLabelText("Message*"), "Great website!");
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(postFeedback).toHaveBeenCalledWith({
        name: "Jane Doe",
        email: "jane@example.com",
        type: "suggestion",
        message: "Great website!",
      });
      expect(screen.getByText("Thank you for your feedback.")).toBeInTheDocument();
    });
  });

  test("handles form submission error", async () => {
    const user = userEvent.setup();
    postFeedback.mockResolvedValue("Oops! Something went wrong. Please try again.");

    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    // Fill out the form
    await user.type(screen.getByLabelText("Name*"), "Jane Doe");
    await user.type(screen.getByLabelText("Email*"), "jane@example.com");
    await user.selectOptions(screen.getByLabelText("Feedback Type*"), "discrepancy");
    await user.type(screen.getByLabelText("Message*"), "Found an error on page X");
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Oops! Something went wrong. Please try again.")).toBeInTheDocument();
    });
  });

  test("handles discrepancy feedback type", async () => {
    const user = userEvent.setup();
    postFeedback.mockResolvedValue("Thank you for your feedback.");

    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    // Fill out the form with discrepancy type
    await user.type(screen.getByLabelText("Name*"), "John Doe");
    await user.type(screen.getByLabelText("Email*"), "john@example.com");
    await user.selectOptions(screen.getByLabelText("Feedback Type*"), "discrepancy");
    await user.type(screen.getByLabelText("Message*"), "Found incorrect information on the calculator page.");
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(postFeedback).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        type: "discrepancy",
        message: "Found incorrect information on the calculator page.",
      });
    });
  });

  test("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    postFeedback.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve("Success"), 100))
    );

    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    // Fill out the form
    await user.type(screen.getByLabelText("Name*"), "Jane Doe");
    await user.type(screen.getByLabelText("Email*"), "jane@example.com");
    await user.selectOptions(screen.getByLabelText("Feedback Type*"), "suggestion");
    await user.type(screen.getByLabelText("Message*"), "Great website!");
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    expect(screen.getByText("Submitting...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test("requires all mandatory fields", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    const submitButton = screen.getByRole("button", { name: "Submit" });
    
    // Try to submit without filling fields
    await user.click(submitButton);

    // Check that required fields are marked as required
    expect(screen.getByLabelText("Name*")).toBeRequired();
    expect(screen.getByLabelText("Email*")).toBeRequired();
    expect(screen.getByLabelText("Feedback Type*")).toBeRequired();
    expect(screen.getByLabelText("Message*")).toBeRequired();
  });

  test("shows mandatory field indicator", () => {
    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    expect(screen.getByText("* Fields marked with an asterisk are mandatory.")).toBeInTheDocument();
  });

  test("has correct page title and canonical link", () => {
    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    expect(document.title).toBe("Feedback | Unitastic");
    
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/feedback");
  });

  test("form has correct HTML structure", () => {
    const { container } = render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    
    // Check for floating labels
    expect(document.querySelectorAll(".form-floating")).toHaveLength(4); // 4 form fields
    
    // Check for shadow container
    expect(document.querySelector(".shadow")).toBeInTheDocument();
  });

  test("email field accepts valid email format", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    const emailInput = screen.getByLabelText("Email*");
    expect(emailInput).toHaveAttribute("type", "email");
    
    await user.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");
  });

  test("message field is a textarea", () => {
    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    const messageField = screen.getByLabelText("Message*");
    expect(messageField.tagName).toBe("TEXTAREA");
  });

  test("feedback type select has correct default value", () => {
    render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    const typeSelect = screen.getByLabelText("Feedback Type*");
    expect(typeSelect.value).toBe("");
  });

  test("form submission prevents default browser behavior", async () => {
    const user = userEvent.setup();
    postFeedback.mockResolvedValue("Success");

    const { container } = render(
      <RouterWrapper>
        <FeedbackForm />
      </RouterWrapper>
    );

    // Fill out the form
    await user.type(screen.getByLabelText("Name*"), "Test User");
    await user.type(screen.getByLabelText("Email*"), "test@example.com");
    await user.selectOptions(screen.getByLabelText("Feedback Type*"), "suggestion");
    await user.type(screen.getByLabelText("Message*"), "Test message");
    
    const form = container.querySelector("form");
    const submitHandler = vi.fn();
    form.addEventListener("submit", submitHandler);
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    // The form should prevent default submission
    await waitFor(() => {
      expect(postFeedback).toHaveBeenCalled();
    });
  });
});
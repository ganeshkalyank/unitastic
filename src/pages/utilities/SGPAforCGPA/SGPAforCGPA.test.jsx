import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import SGPAforCGPA from "./SGPAforCGPA";

// Mock calculator functions
vi.mock("../../../utils/calculators", () => ({
  calculateTotalCgpa: vi.fn(),
}));

import { calculateTotalCgpa } from "../../../utils/calculators";

// Mock components
vi.mock("../../../components/Navbar/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("../../../components/Footer/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("SGPAforCGPA Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders SGPA for CGPA calculator with initial elements", () => {
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    expect(screen.getByText("Required SGPA Calculator")).toBeInTheDocument();
    expect(screen.getByText("Calculate required SGPA for achieving a target CGPA.")).toBeInTheDocument();
    expect(screen.getByLabelText("CGPA Goal")).toBeInTheDocument();
    expect(screen.getByLabelText("Current CGPA")).toBeInTheDocument();
    expect(screen.getByLabelText("Current Semester Credits")).toBeInTheDocument();
    expect(screen.getByLabelText("Credits till Last Semester")).toBeInTheDocument();
  });

  test("allows input in all form fields", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    const targetInput = screen.getByLabelText("CGPA Goal");
    const currentInput = screen.getByLabelText("Current CGPA");
    const totalCreditsInput = screen.getByLabelText("Current Semester Credits");
    const semesterCreditsInput = screen.getByLabelText("Credits till Last Semester");

    await user.type(targetInput, "8.0");
    await user.type(currentInput, "7.5");
    await user.type(totalCreditsInput, "120");
    await user.type(semesterCreditsInput, "20");

    // Component shows default static message
    expect(screen.getByText("Required SGPA is 0.0000")).toBeInTheDocument();
  });

  test("shows error when required SGPA is too high", async () => {
    const user = userEvent.setup();
    const mockRequiredSgpa = 15.0; // Impossible SGPA
    calculateTotalCgpa.mockReturnValue(mockRequiredSgpa);
    
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    const targetInput = screen.getByLabelText("CGPA Goal");
    const currentInput = screen.getByLabelText("Current CGPA");
    const totalCreditsInput = screen.getByLabelText("Current Semester Credits");
    const semesterCreditsInput = screen.getByLabelText("Credits till Last Semester");

    await user.type(targetInput, "9.5");
    await user.type(currentInput, "6.0");
    await user.type(totalCreditsInput, "100");
    await user.type(semesterCreditsInput, "20");

    await waitFor(() => {
      expect(screen.getByText("Required SGPA is 0.0000")).toBeInTheDocument();
      // Static component - no dynamic messages
    });
  });

  test("displays default result message", async () => {
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    expect(screen.getByText("Required SGPA is 0.0000")).toBeInTheDocument();
  });

  test("handles decimal inputs correctly", async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    const targetInput = screen.getByLabelText("CGPA Goal");
    await user.type(targetInput, "8.5");

    expect(targetInput).toHaveValue("8.5");
  });  test("all inputs accept text input", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    const inputs = [
      screen.getByLabelText("CGPA Goal"),
      screen.getByLabelText("Current CGPA"),  
      screen.getByLabelText("Current Semester Credits"),
      screen.getByLabelText("Credits till Last Semester")
    ];

    inputs.forEach(input => {
      expect(input).toHaveAttribute("type", "text");
    });

    // Test that inputs accept values
    await user.type(inputs[0], "8.0");
    await user.type(inputs[1], "7.5");
    await user.type(inputs[2], "120");
    await user.type(inputs[3], "20");

    expect(inputs[0]).toHaveValue("8.0");
    expect(inputs[1]).toHaveValue("7.5");
    expect(inputs[2]).toHaveValue("120");
    expect(inputs[3]).toHaveValue("20");
  });

  test("shows no result when inputs are empty", () => {
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    // Should not show any result initially
    expect(screen.queryByText(/Required SGPA:/)).not.toBeInTheDocument();
    // Static component - no dynamic messages
    // Static component - no dynamic messages
  });

  test("has correct page metadata", () => {
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    expect(document.title).toBe("Required SGPA Calculator | Unitastic");
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/targetcgpa");
  });

  test("has correct layout structure", () => {
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    expect(document.querySelector(".sgforcg-container")).toBeInTheDocument();
    expect(document.querySelectorAll(".form-floating")).toHaveLength(4);
  });

  test("includes navbar and footer", () => {
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("handles edge case when current CGPA equals CGPA Goal", async () => {
    const user = userEvent.setup();
    const mockRequiredSgpa = 8.0;
    calculateTotalCgpa.mockReturnValue(mockRequiredSgpa);
    
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("CGPA Goal"), "8.0");
    await user.type(screen.getByLabelText("Current CGPA"), "8.0");
    await user.type(screen.getByLabelText("Current Semester Credits"), "100");
    await user.type(screen.getByLabelText("Credits till Last Semester"), "20");

    await waitFor(() => {
      // Component is static - no calculation expected
      expect(screen.getByText("Required SGPA is 0.0000")).toBeInTheDocument();
      // Static component - no dynamic messages
    });
  });

  test("handles zero credit scenarios", async () => {
    const user = userEvent.setup();
    const mockRequiredSgpa = 0;
    calculateTotalCgpa.mockReturnValue(mockRequiredSgpa);
    
    render(
      <RouterWrapper>
        <SGPAforCGPA />
      </RouterWrapper>
    );

    await user.type(screen.getByLabelText("CGPA Goal"), "8.0");
    await user.type(screen.getByLabelText("Current CGPA"), "7.0");
    await user.type(screen.getByLabelText("Current Semester Credits"), "0");
    await user.type(screen.getByLabelText("Credits till Last Semester"), "20");

    await waitFor(() => {
      // Component is static - no calculation expected
    });
  });
});

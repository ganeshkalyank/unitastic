import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import CGPACalculator from "./CGPACalculator";

// Mock calculator functions
vi.mock("../../../utils/calculators", () => ({
  calculateCGPA: vi.fn(),
}));

import { calculateCGPA } from "../../../utils/calculators";

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

describe("CGPACalculator Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders CGPA calculator with initial elements", () => {
    render(
      <RouterWrapper>
        <CGPACalculator />
      </RouterWrapper>
    );

    expect(screen.getByText("CGPA Calculator")).toBeInTheDocument();
    expect(screen.getByText("Calculate your CGPA based on SGPA and credits.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Semester" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calculate CGPA" })).toBeInTheDocument();
    expect(screen.getByText("Your CGPA is 0.0000")).toBeInTheDocument();
  });

  test("adds semesters and calculates CGPA", async () => {
    const user = userEvent.setup();
    calculateCGPA.mockReturnValue(8.75);
    
    render(
      <RouterWrapper>
        <CGPACalculator />
      </RouterWrapper>
    );

    // Add two semesters
    const addButton = screen.getByRole("button", { name: "Add Semester" });
    await user.click(addButton);
    await user.click(addButton);

    // Fill in semester data
    const creditsInputs = screen.getAllByPlaceholderText("Credits");
    const sgpaInputs = screen.getAllByPlaceholderText("SGPA");
    
    await user.type(creditsInputs[0], "20");
    await user.type(sgpaInputs[0], "9.0");
    
    await user.type(creditsInputs[1], "18");
    await user.type(sgpaInputs[1], "8.5");

    const calculateButton = screen.getByRole("button", { name: "Calculate CGPA" });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(calculateCGPA).toHaveBeenCalledWith([
        { credits: "20", sgpa: "9" },
        { credits: "18", sgpa: "8.5" },
      ]);
      expect(screen.getByText("Your CGPA is 8.7500")).toBeInTheDocument();
    });
  });

  test("removes semesters correctly", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <CGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Semester" });
    await user.click(addButton);
    await user.click(addButton);

    expect(screen.getByText("Semester 1")).toBeInTheDocument();
    expect(screen.getByText("Semester 2")).toBeInTheDocument();

    // Remove first semester
    const removeButtons = document.querySelectorAll(".btn-danger");
    await user.click(removeButtons[0]);

    expect(screen.getByText("Semester 1")).toBeInTheDocument();
    expect(screen.queryByText("Semester 2")).not.toBeInTheDocument();
  });

  test("has correct page metadata", () => {
    render(
      <RouterWrapper>
        <CGPACalculator />
      </RouterWrapper>
    );

    expect(document.title).toBe("CGPA Calculator | Unitastic");
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/cgpa");
  });
});
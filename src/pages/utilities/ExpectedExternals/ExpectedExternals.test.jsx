import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import ExpectedExternals from "./ExpectedExternals";

// Mock calculator functions
vi.mock("../../../utils/calculators", () => ({
  calculateExternals: vi.fn(),
}));

import { calculateExternals } from "../../../utils/calculators";

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

describe("ExpectedExternals Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders expected externals calculator with initial elements", () => {
    render(
      <RouterWrapper>
        <ExpectedExternals />
      </RouterWrapper>
    );

    expect(screen.getByText("Expected Externals")).toBeInTheDocument();
    expect(screen.getByText("Calculate the externals marks required to get each overall grade based on internal marks.")).toBeInTheDocument();
    expect(screen.getByLabelText("Internals")).toBeInTheDocument();
    
    // Check for grade table headers
    expect(screen.getByText("Grade")).toBeInTheDocument();
    expect(screen.getByText("Externals")).toBeInTheDocument();
  });

  test("calculates externals when internals input changes", async () => {
    const user = userEvent.setup();
    const mockExternals = {
      "S": 82,
      "A+": 72,
      "A": 50,
      "B": 32,
      "C": 10,
      "D": 0,
    };
    calculateExternals.mockReturnValue(mockExternals);
    
    render(
      <RouterWrapper>
        <ExpectedExternals />
      </RouterWrapper>
    );

    const internalsInput = screen.getByLabelText("Internals");
    await user.type(internalsInput, "50");

    await waitFor(() => {
      expect(calculateExternals).toHaveBeenCalledWith("50");
      expect(screen.getByText("82")).toBeInTheDocument(); // S grade
      expect(screen.getByText("72")).toBeInTheDocument(); // A+ grade
      expect(screen.getByText("50")).toBeInTheDocument(); // A grade
      expect(screen.getByText("32")).toBeInTheDocument(); // B grade
      expect(screen.getByText("10")).toBeInTheDocument(); // C grade
      expect(screen.getByText("0")).toBeInTheDocument();  // D grade
    });
  });

  test("shows NA for grades when externals exceed 100", async () => {
    const user = userEvent.setup();
    const mockExternals = {
      "S": 150, // Over 100
      "A+": 140,
      "A": 120,
      "B": 100,
      "C": 80,
      "D": 60,
    };
    calculateExternals.mockReturnValue(mockExternals);
    
    render(
      <RouterWrapper>
        <ExpectedExternals />
      </RouterWrapper>
    );

    const internalsInput = screen.getByLabelText("Internals");
    await user.type(internalsInput, "10");

    await waitFor(() => {
      // Should show NA for grades over 100
      const naElements = screen.getAllByText("NA");
      expect(naElements.length).toBeGreaterThan(0);
      
      // Should show actual values for grades <= 100
      expect(screen.getByText("100")).toBeInTheDocument(); // B grade
      expect(screen.getByText("80")).toBeInTheDocument();  // C grade
      expect(screen.getByText("60")).toBeInTheDocument();  // D grade
    });
  });

  test("shows all NA when internals are too high", async () => {
    const user = userEvent.setup();
    const mockExternals = {
      "S": "NA",
      "A+": "NA", 
      "A": "NA",
      "B": "NA",
      "C": "NA",
      "D": "NA",
    };
    calculateExternals.mockReturnValue(mockExternals);
    
    render(
      <RouterWrapper>
        <ExpectedExternals />
      </RouterWrapper>
    );

    const internalsInput = screen.getByLabelText("Internals");
    await user.type(internalsInput, "60");

    await waitFor(() => {
      expect(calculateExternals).toHaveBeenCalledWith("60");
      const naElements = screen.getAllByText("NA");
      expect(naElements).toHaveLength(6); // All 6 grades should show NA
    });
  });

  test("renders grade table with all grade rows", () => {
    render(
      <RouterWrapper>
        <ExpectedExternals />
      </RouterWrapper>
    );

    // Check that all grade letters are present in the table
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("A+")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  test("has correct page metadata", () => {
    render(
      <RouterWrapper>
        <ExpectedExternals />
      </RouterWrapper>
    );

    expect(document.title).toBe("Expected Externals | Unitastic");
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/externals");
  });

  test("has correct layout structure", () => {
    render(
      <RouterWrapper>
        <ExpectedExternals />
      </RouterWrapper>
    );

    expect(document.querySelector(".externals-container")).toBeInTheDocument();
    expect(document.querySelector(".form-floating")).toBeInTheDocument();
    expect(document.querySelector(".table")).toBeInTheDocument();
  });

  test("internals input accepts text input", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <ExpectedExternals />
      </RouterWrapper>
    );

    const internalsInput = screen.getByLabelText("Internals");
    expect(internalsInput).toHaveAttribute("type", "text");
    
    await user.type(internalsInput, "45");
    expect(internalsInput).toHaveValue("45");
  });

  test("includes navbar and footer", () => {
    render(
      <RouterWrapper>
        <ExpectedExternals />
      </RouterWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
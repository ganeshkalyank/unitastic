import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import AttendanceCalculator from "./AttendanceCalculator";

// Mock calculator functions
vi.mock("../../../utils/calculators", () => ({
  calculateCanBunk: vi.fn(),
}));

import { calculateCanBunk } from "../../../utils/calculators";

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

describe("AttendanceCalculator Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders attendance calculator with initial elements", () => {
    render(
      <RouterWrapper>
        <AttendanceCalculator />
      </RouterWrapper>
    );

    expect(screen.getByText("Class Skippability Calculator")).toBeInTheDocument();
    expect(screen.getByLabelText("Credits")).toBeInTheDocument();
    expect(screen.getByLabelText("Skipped")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calculate" })).toBeInTheDocument();
  });

  test("calculates skippable classes correctly", async () => {
    const user = userEvent.setup();
    calculateCanBunk.mockReturnValue(8);
    
    render(
      <RouterWrapper>
        <AttendanceCalculator />
      </RouterWrapper>
    );

    const creditsInput = screen.getByLabelText("Credits");
    const skippedInput = screen.getByLabelText("Skipped");
    
    await user.type(creditsInput, "4");
    await user.type(skippedInput, "2");

    const calculateButton = screen.getByRole("button", { name: "Calculate" });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(calculateCanBunk).toHaveBeenCalledWith("4", "2");
      expect(screen.getByText("You can skip 8 classes")).toBeInTheDocument();
    });
  });

  test("shows cannot skip message when result is zero or negative", async () => {
    const user = userEvent.setup();
    calculateCanBunk.mockReturnValue(0);
    
    render(
      <RouterWrapper>
        <AttendanceCalculator />
      </RouterWrapper>
    );

    const creditsInput = screen.getByLabelText("Credits");
    const skippedInput = screen.getByLabelText("Skipped");
    
    await user.type(creditsInput, "2");
    await user.type(skippedInput, "8");

    const calculateButton = screen.getByRole("button", { name: "Calculate" });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText("You can't skip any classes")).toBeInTheDocument();
    });
  });

  test("has correct page metadata", () => {
    render(
      <RouterWrapper>
        <AttendanceCalculator />
      </RouterWrapper>
    );

    expect(document.title).toBe("Class Skippability | Unitastic");
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/attendance");
  });
});
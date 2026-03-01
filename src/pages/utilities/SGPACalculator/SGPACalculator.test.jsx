import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import SGPACalculator from "./SGPACalculator";

// Mock calculator functions
vi.mock("../../../utils/calculators", () => ({
  calculateSGPA: vi.fn(),
}));

import { calculateSGPA } from "../../../utils/calculators";

// Mock components to simplify testing
vi.mock("../../../components/Navbar/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("../../../components/Footer/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

// Wrapper component for React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("SGPACalculator Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders SGPA calculator with initial elements", () => {
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    expect(screen.getByText("SGPA Calculator")).toBeInTheDocument();
    expect(screen.getByText("Calculate your SGPA based on credits and expected grade.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Subject" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calculate" })).toBeInTheDocument();
    expect(screen.getByText("Your SGPA is 0.0000")).toBeInTheDocument();
  });

  test("adds a subject when Add Subject button is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Subject" });
    await user.click(addButton);

    expect(screen.getByText("Subject 1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Credits")).toBeInTheDocument();
    
    // Check for grade select dropdown
    const gradeSelect = screen.getByDisplayValue("S");
    expect(gradeSelect).toBeInTheDocument();
    
    // Check for remove button
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument(); // FontAwesome icon button
  });

  test("adds multiple subjects", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Subject" });
    
    // Add three subjects
    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);

    expect(screen.getByText("Subject 1")).toBeInTheDocument();
    expect(screen.getByText("Subject 2")).toBeInTheDocument();
    expect(screen.getByText("Subject 3")).toBeInTheDocument();
  });

  test("handles credits input for subjects", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Subject" });
    await user.click(addButton);

    const creditsInput = screen.getByPlaceholderText("Credits");
    await user.type(creditsInput, "4");

    expect(creditsInput).toHaveValue(4);
  });

  test("handles grade selection for subjects", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Subject" });
    await user.click(addButton);

    const gradeSelect = screen.getByDisplayValue("S");
    await user.selectOptions(gradeSelect, "A+");

    expect(gradeSelect.value).toBe("A+");
  });

  test("renders all grade options in select", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Subject" });
    await user.click(addButton);

    const gradeSelect = screen.getByDisplayValue("S");
    
    // Check that all grade options are present
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("A+")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
  });

  test("removes a subject when remove button is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Subject" });
    await user.click(addButton);
    await user.click(addButton);

    expect(screen.getByText("Subject 1")).toBeInTheDocument();
    expect(screen.getByText("Subject 2")).toBeInTheDocument();

    // Click the first remove button
    const removeButtons = screen.getAllByRole("button", { name: "" });
    const firstRemoveButton = removeButtons.find(button => 
      button.classList.contains("btn-danger")
    );
    await user.click(firstRemoveButton);

    // Should now only have Subject 1 (the second subject becomes the first)
    expect(screen.getByText("Subject 1")).toBeInTheDocument();
    expect(screen.queryByText("Subject 2")).not.toBeInTheDocument();
  });

  test("calculates SGPA when Calculate button is clicked", async () => {
    const user = userEvent.setup();
    calculateSGPA.mockReturnValue(8.5);
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Subject" });
    await user.click(addButton);
    await user.click(addButton);

    // Fill in first subject
    const creditsInputs = screen.getAllByPlaceholderText("Credits");
    const gradeSelects = screen.getAllByDisplayValue("S");
    
    await user.type(creditsInputs[0], "4");
    await user.selectOptions(gradeSelects[0], "A+");
    
    // Fill in second subject
    await user.type(creditsInputs[1], "3");
    await user.selectOptions(gradeSelects[1], "A");

    const calculateButton = screen.getByRole("button", { name: "Calculate" });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(calculateSGPA).toHaveBeenCalledWith([
        { credits: "4", grade: "A+" },
        { credits: "3", grade: "A" },
      ]);
      expect(screen.getByText("Your SGPA is 8.5000")).toBeInTheDocument();
    });
  });

  test("handles empty subjects list when calculating", async () => {
    const user = userEvent.setup();
    calculateSGPA.mockReturnValue(0);
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const calculateButton = screen.getByRole("button", { name: "Calculate" });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(calculateSGPA).toHaveBeenCalledWith([]);
      expect(screen.getByText("Your SGPA is 0.0000")).toBeInTheDocument();
    });
  });

  test("updates subject data when inputs change", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Subject" });
    await user.click(addButton);

    const creditsInput = screen.getByPlaceholderText("Credits");
    const gradeSelect = screen.getByDisplayValue("S");

    // Change credits
    await user.clear(creditsInput);
    await user.type(creditsInput, "6");
    expect(creditsInput).toHaveValue(6);

    // Change grade
    await user.selectOptions(gradeSelect, "B");
    expect(gradeSelect.value).toBe("B");
  });

  test("maintains subject order when removing from middle", async () => {
    const user = userEvent.setup();
    
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    const addButton = screen.getByRole("button", { name: "Add Subject" });
    // Add three subjects
    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);

    // Fill in data to identify subjects
    const creditsInputs = screen.getAllByPlaceholderText("Credits");
    await user.type(creditsInputs[0], "1");
    await user.type(creditsInputs[1], "2");
    await user.type(creditsInputs[2], "3");

    // Remove the middle subject (index 1)
    const removeButtons = document.querySelectorAll(".btn-danger");
    await user.click(removeButtons[1]);

    // Should now have subjects with credits 1 and 2 (third input moves up)
    const remainingInputs = screen.getAllByPlaceholderText("Credits");
    expect(remainingInputs[0]).toHaveValue(1);
    expect(remainingInputs[1]).toHaveValue(2);
    expect(remainingInputs).toHaveLength(2);
  });

  test("has correct page title and canonical link", () => {
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    expect(document.title).toBe("SGPA Calculator | Unitastic");
    
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/sgpa");
  });

  test("includes navbar and footer", () => {
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("has correct responsive layout structure", () => {
    render(
      <RouterWrapper>
        <SGPACalculator />
      </RouterWrapper>
    );

    expect(document.querySelector(".container")).toBeInTheDocument();
    expect(document.querySelector(".sgpa-container")).toBeInTheDocument();
    expect(document.querySelector(".shadow")).toBeInTheDocument();
  });
});
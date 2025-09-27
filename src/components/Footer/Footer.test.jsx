import { vi, describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Footer";

// Mock react-router-dom hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn().mockReturnValue(vi.fn())
  };
});

// Wrapper component for React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Footer Component", () => {
  test("renders footer with copyright text", () => {
    render(
      <RouterWrapper>
        <Footer />
      </RouterWrapper>
    );

    const currentYear = new Date().getFullYear();
    const copyrightText = `© Copyright Unitastic ${currentYear}. All rights reserved.`;
    
    expect(screen.getByText(copyrightText)).toBeInTheDocument();
  });

  test("renders Terms and Conditions link", () => {
    render(
      <RouterWrapper>
        <Footer />
      </RouterWrapper>
    );

    const termsLink = screen.getByText("Terms and Conditions");
    expect(termsLink).toBeInTheDocument();
    expect(termsLink.closest("a")).toHaveAttribute("href", "/terms");
  });

  test("renders Credits link", () => {
    render(
      <RouterWrapper>
        <Footer />
      </RouterWrapper>
    );

    const creditsLink = screen.getByText("Credits");
    expect(creditsLink).toBeInTheDocument();
    expect(creditsLink.closest("a")).toHaveAttribute("href", "/credits");
  });

  test("renders GitHub link with correct attributes", () => {
    render(
      <RouterWrapper>
        <Footer />
      </RouterWrapper>
    );

    const githubLink = screen.getByText("GitHub");
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/ganeshkalyank/unitastic");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noreferrer");
  });

  test("has correct HTML structure", () => {
    render(
      <RouterWrapper>
        <Footer />
      </RouterWrapper>
    );

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("p-3", "shadow", "bg-white");
  });

  test("renders separators between links", () => {
    const { container } = render(
      <RouterWrapper>
        <Footer />
      </RouterWrapper>
    );

    // Check for the dot separators
    const separators = container.querySelectorAll("p:last-child");
    expect(separators[0]).toHaveTextContent(".");
  });

  test("updates copyright year dynamically", () => {
    // Mock Date to test dynamic year
    const originalDate = Date;
    const mockDate = vi.fn(() => ({ getFullYear: () => 2025 }));
    global.Date = mockDate;

    render(
      <RouterWrapper>
        <Footer />
      </RouterWrapper>
    );

    expect(screen.getByText("© Copyright Unitastic 2025. All rights reserved.")).toBeInTheDocument();

    // Restore original Date
    global.Date = originalDate;
  });
});
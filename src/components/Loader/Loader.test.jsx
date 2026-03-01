import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Loader from "./Loader";

// Wrapper component for React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Mock the Navbar and Footer components to avoid dependency issues
vi.mock("../Navbar/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("../Footer/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

describe("Loader Component", () => {
  test("renders loading spinner", () => {
    render(
      <RouterWrapper>
        <Loader />
      </RouterWrapper>
    );

    const spinner = document.querySelector(".spinner-border");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("text-primary");
  });

  test("renders loading text for screen readers", () => {
    render(
      <RouterWrapper>
        <Loader />
      </RouterWrapper>
    );

    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveClass("visually-hidden");
  });

  test("includes navbar and footer", () => {
    render(
      <RouterWrapper>
        <Loader />
      </RouterWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("has correct container structure", () => {
    render(
      <RouterWrapper>
        <Loader />
      </RouterWrapper>
    );

    const container = document.querySelector(".loader-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("container", "d-flex", "justify-content-center");
  });

  test("spinner has correct accessibility attributes", () => {
    render(
      <RouterWrapper>
        <Loader />
      </RouterWrapper>
    );

    const spinner = document.querySelector(".spinner-border");
    expect(spinner).toHaveAttribute("role", "status");
  });

  test("maintains layout structure", () => {
    const { container } = render(
      <RouterWrapper>
        <Loader />
      </RouterWrapper>
    );

    // Check that the loader is wrapped properly
    expect(container.firstChild).toBeTruthy();
    
    // Navbar should be first
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    
    // Loader container in the middle
    expect(document.querySelector(".loader-container")).toBeInTheDocument();
    
    // Footer should be last
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
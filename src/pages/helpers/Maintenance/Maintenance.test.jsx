import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Maintenance from "./Maintenance";

// Mock SVG asset
vi.mock("../../assets/notfound.svg", () => ({
  default: "mocked-notfound.svg",
}));

// Mock constants
vi.mock("../../../utils/constants", () => ({
  BASE_URL: "https://unitastic.netlify.app",
}));

describe("Maintenance Component", () => {
  test("renders maintenance page with title", () => {
    render(<Maintenance />);

    const titles = screen.getAllByText("Unitastic");
    expect(titles).toHaveLength(1); // Only in heading, title tag doesn't render as text
    
    expect(screen.getByText("Under Maintenance!")).toBeInTheDocument();
  });

  test("renders maintenance image with correct attributes", () => {
    render(<Maintenance />);

    const image = screen.getByAltText("Not Found");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/src/assets/notfound.svg");
    expect(image).toHaveClass("maintenance-img");
  });

  test("has correct page metadata", () => {
    render(<Maintenance />);

    expect(document.title).toBe("Unitastic");
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app");
  });

  test("has correct layout structure", () => {
    render(<Maintenance />);

    expect(document.querySelector(".maintenance-container")).toBeInTheDocument();
    expect(document.querySelector(".container")).toBeInTheDocument();
  });

  test("renders with proper heading hierarchy", () => {
    render(<Maintenance />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(2);
    
    expect(headings[0]).toHaveTextContent("Unitastic");
    expect(headings[1]).toHaveTextContent("Under Maintenance!");
    
    headings.forEach(heading => {
      expect(heading).toHaveClass("maintenance-title");
      expect(heading).toHaveClass("text-center");
    });
  });

  test("uses Bootstrap utility classes correctly", () => {
    render(<Maintenance />);

    expect(document.querySelector(".container")).toBeInTheDocument();
    expect(document.querySelector(".text-center")).toBeInTheDocument();
    expect(document.querySelector(".d-flex")).toBeInTheDocument();
    expect(document.querySelector(".justify-content-center")).toBeInTheDocument();
  });

  test("image has proper accessibility attributes", () => {
    render(<Maintenance />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Not Found");
  });

  test("does not include navbar and footer", () => {
    render(<Maintenance />);

    // Maintenance page should be standalone without navigation
    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("footer")).not.toBeInTheDocument();
  });

  test("page structure renders correctly", () => {
    const { container } = render(<Maintenance />);

    // Should have the basic structure without throwing errors
    expect(container.firstChild).toBeTruthy();
    expect(container.querySelector("h1")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  test("renders maintenance message prominently", () => {
    render(<Maintenance />);

    const maintenanceMessage = screen.getByText("Under Maintenance!");
    expect(maintenanceMessage).toHaveClass("maintenance-title");
    expect(maintenanceMessage).toHaveClass("text-center");
  });

  test("uses same image as 404 page", () => {
    render(<Maintenance />);

    const image = screen.getByAltText("Not Found");
    expect(image).toHaveAttribute("src", "/src/assets/notfound.svg");
  });

  test("canonical link points to root URL", () => {
    render(<Maintenance />);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app");
  });

  test("image is centered using Bootstrap flex utilities", () => {
    render(<Maintenance />);

    const imageContainer = screen.getByAltText("Not Found").parentElement;
    expect(imageContainer).toHaveClass("d-flex");
    expect(imageContainer).toHaveClass("justify-content-center");
  });

  test("minimal page design without navigation", () => {
    const { container } = render(<Maintenance />);

    // Should be a simple maintenance page without complex navigation
    expect(container.querySelectorAll("nav")).toHaveLength(0);
    expect(container.querySelectorAll("footer")).toHaveLength(0);
    expect(container.querySelectorAll("a")).toHaveLength(0);
  });
});
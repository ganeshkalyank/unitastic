import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PageNotFound from "./PageNotFound";

// Mock components
vi.mock("../../../components/Navbar/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("../../../components/Footer/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock SVG asset
vi.mock("../../../assets/notfound.svg", () => ({
  default: "mocked-notfound.svg",
}));

const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("PageNotFound Component", () => {
  test("renders 404 page with main elements", () => {
    render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByText("The page you are looking for does not exist or has been moved.")).toBeInTheDocument();
  });

  test("renders 404 image with correct attributes", () => {
    render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    const image = screen.getByAltText("404");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "mocked-notfound.svg");
    expect(image).toHaveClass("notfound-img");
  });

  test("has correct page title", () => {
    render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    expect(document.title).toBe("Page Not Found | Unitastic");
  });

  test("includes navbar and footer", () => {
    render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("has correct layout structure", () => {
    render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    expect(document.querySelector(".notfound-container")).toBeInTheDocument();
    expect(document.querySelector(".col-lg-6")).toBeInTheDocument();
    expect(document.querySelector(".text-center")).toBeInTheDocument();
  });

  test("renders with proper heading hierarchy", () => {
    render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    const h1 = screen.getByRole("heading", { level: 1, name: "404" });
    const h2 = screen.getByRole("heading", { level: 2, name: "Page Not Found" });
    
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
    expect(h1).toHaveClass("notfound-title");
    expect(h2).toHaveClass("notfound-subtitle");
  });

  test("error message has correct styling class", () => {
    render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    const errorMessage = screen.getByText("The page you are looking for does not exist or has been moved.");
    expect(errorMessage).toHaveClass("notfound-text");
  });

  test("uses Bootstrap classes correctly", () => {
    render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    expect(document.querySelector(".container")).toBeInTheDocument();
    expect(document.querySelector(".row")).toBeInTheDocument();
    expect(document.querySelector(".d-flex")).toBeInTheDocument();
    expect(document.querySelector(".align-items-center")).toBeInTheDocument();
    expect(document.querySelector(".justify-content-center")).toBeInTheDocument();
  });

  test("image has proper accessibility attributes", () => {
    render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "404");
  });

  test("page structure renders correctly without errors", () => {
    const { container } = render(
      <RouterWrapper>
        <PageNotFound />
      </RouterWrapper>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
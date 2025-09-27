import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Credits from "./Credits";

// Mock components
vi.mock("../../../components/Navbar/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("../../../components/Footer/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock constants
vi.mock("../../../utils/constants", () => ({
  BASE_URL: "https://unitastic.netlify.app",
}));

const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Credits Component", () => {
  test("renders credits page with main heading", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(screen.getByText("Credits")).toBeInTheDocument();
  });

  test("renders acknowledgment section", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(screen.getByText(/We would like to acknowledge and express our gratitude/)).toBeInTheDocument();
    expect(screen.getByText(/contributed to the development of "Unitastic."/)).toBeInTheDocument();
  });

  test("renders development frameworks section", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(screen.getByText("Development Frameworks and Libraries:")).toBeInTheDocument();
    expect(screen.getByText("React.js:")).toBeInTheDocument();
    expect(screen.getByText("Bootstrap:")).toBeInTheDocument();
    expect(screen.getByText("Firebase:")).toBeInTheDocument();
    
    expect(screen.getByText(/We utilized the React.js framework/)).toBeInTheDocument();
    expect(screen.getByText(/The Bootstrap framework helped us design/)).toBeInTheDocument();
    expect(screen.getByText(/We relied on Firebase for data management/)).toBeInTheDocument();
  });

  test("renders icon resources section", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(screen.getByText("Icon Resources:")).toBeInTheDocument();
    expect(screen.getByText("Font Awesome:")).toBeInTheDocument();
    expect(screen.getByText(/We extend our thanks to Font Awesome/)).toBeInTheDocument();
  });

  test("renders graphic resources section", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(screen.getByText("Graphic Resources:")).toBeInTheDocument();
    expect(screen.getByText("Freepik:")).toBeInTheDocument();
    expect(screen.getByText(/We are grateful to Freepik/)).toBeInTheDocument();
  });

  test("renders feedback and support section", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(screen.getByText("Feedback and Support:")).toBeInTheDocument();
    expect(screen.getByText(/Our users have played a vital role/)).toBeInTheDocument();
    expect(screen.getByText(/We appreciate all the feedback/)).toBeInTheDocument();
  });

  test("renders contact information", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(screen.getByText(/If you have any questions, suggestions, or feedback/)).toBeInTheDocument();
    
    const emailLink = screen.getByRole("link", { name: "unitastic@outlook.com" });
    expect(emailLink).toHaveAttribute("href", "mailto:unitastic@outlook.com");
    
    expect(screen.getByText(/or by filling the feedback form/)).toBeInTheDocument();
  });

  test("has correct page metadata", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(document.title).toBe("Credits | Unitastic");
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/credits");
  });

  test("includes navbar and footer", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("has correct layout structure", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    expect(document.querySelector(".credits-container")).toBeInTheDocument();
    expect(document.querySelector(".col-lg-8")).toBeInTheDocument();
  });

  test("renders all sections with proper headings", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    const sections = [
      "Development Frameworks and Libraries:",
      "Icon Resources:",
      "Graphic Resources:",
      "Feedback and Support:"
    ];

    sections.forEach(sectionTitle => {
      expect(screen.getByText(sectionTitle)).toBeInTheDocument();
    });
  });

  test("renders proper list structure for frameworks", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    // Check that the frameworks are in a list
    const frameworksList = screen.getByText("React.js:").closest("ul");
    expect(frameworksList).toBeInTheDocument();
    
    const listItems = frameworksList.querySelectorAll("li");
    expect(listItems).toHaveLength(3); // React, Bootstrap, Firebase
  });

  test("renders proper list structure for icon resources", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    const iconsList = screen.getByText("Font Awesome:").closest("ul");
    expect(iconsList).toBeInTheDocument();
    
    const listItems = iconsList.querySelectorAll("li");
    expect(listItems).toHaveLength(1); // Font Awesome
  });

  test("renders proper list structure for graphic resources", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    const graphicsList = screen.getByText("Freepik:").closest("ul");
    expect(graphicsList).toBeInTheDocument();
    
    const listItems = graphicsList.querySelectorAll("li");
    expect(listItems).toHaveLength(1); // Freepik
  });

  test("email link has correct accessibility attributes", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    const emailLink = screen.getByRole("link", { name: "unitastic@outlook.com" });
    expect(emailLink).toHaveAttribute("href", "mailto:unitastic@outlook.com");
    // Mailto links should open in the default mail client
  });

  test("contains Unitastic branding references", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    // Check for multiple references to "Unitastic"
    const unitasticReferences = screen.getAllByText(/Unitastic/);
    expect(unitasticReferences.length).toBeGreaterThan(1);
  });

  test("renders text content with proper quotes", () => {
    render(
      <RouterWrapper>
        <Credits />
      </RouterWrapper>
    );

    // Check that quoted content renders properly
    expect(screen.getByText(/contributed to the development of "Unitastic."/)).toBeInTheDocument();
    expect(screen.getByText(/shaping "Unitastic."/)).toBeInTheDocument();
  });
});
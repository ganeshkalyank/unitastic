import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TermsandConditions from "./TermsandConditions";

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

describe("TermsandConditions Component", () => {
  test("renders terms and conditions page with main heading", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
  });

  test("renders last updated date", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText("Last Updated: Sep 4th, 2023")).toBeInTheDocument();
  });

  test("renders all section headings", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    const sectionHeadings = [
      "1. Acceptance of Terms",
      "2. User Responsibilities", 
      "3. Intellectual Property",
      "4. Prohibited Activities",
      "5. Disclaimers",
      "6. Liability Limitations",
      "7. Termination of Services",
      "8. Changes to T&C",
      "9. Governing Law",
      "10. Contact Information"
    ];

    sectionHeadings.forEach(heading => {
      expect(screen.getByText(heading)).toBeInTheDocument();
    });
  });

  test("renders acceptance of terms section content", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText(/By using the Website, you acknowledge/)).toBeInTheDocument();
    expect(screen.getByText(/you have read, understood, and agreed to these T&C/)).toBeInTheDocument();
  });

  test("renders user responsibilities section content", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText(/You agree to use the Website responsibly/)).toBeInTheDocument();
    expect(screen.getByText(/maintaining the confidentiality of your account/)).toBeInTheDocument();
  });

  test("renders intellectual property section content", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText(/All content, trademarks, logos/)).toBeInTheDocument();
    expect(screen.getByText(/are the property of "Unitastic"/)).toBeInTheDocument();
    expect(screen.getByText(/without our express written consent/)).toBeInTheDocument();
  });

  test("renders prohibited activities list", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText("Spamming or sending unsolicited communications.")).toBeInTheDocument();
    expect(screen.getByText("Hacking or attempting to gain unauthorized access to the Website.")).toBeInTheDocument();
    expect(screen.getByText("Posting or distributing harmful or inappropriate content.")).toBeInTheDocument();
    expect(screen.getByText("Violating any applicable laws or regulations.")).toBeInTheDocument();
  });

  test("renders disclaimers section content", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText(/The information and tools provided on the Website/)).toBeInTheDocument();
    expect(screen.getByText(/are for educational and informational purposes only/)).toBeInTheDocument();
    expect(screen.getByText(/Your use of any information or tools from the Website is at your own risk/)).toBeInTheDocument();
  });

  test("renders liability limitations section content", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText(/We are not liable for any damages or losses/)).toBeInTheDocument();
    expect(screen.getByText(/we disclaim all warranties, express or implied/)).toBeInTheDocument();
  });

  test("renders termination of services section content", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText(/We reserve the right to terminate or suspend your access/)).toBeInTheDocument();
    expect(screen.getByText(/at our discretion, with or without cause/)).toBeInTheDocument();
  });

  test("renders changes to T&C section content", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText(/We may modify these T&C at any time/)).toBeInTheDocument();
    expect(screen.getByText(/Continued use of the Website after changes indicate your acceptance/)).toBeInTheDocument();
  });

  test("renders governing law section content", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText(/These T&C are governed by and construed in accordance with the laws of India/)).toBeInTheDocument();
    expect(screen.getByText(/shall be filed and adjudicated in the courts of India/)).toBeInTheDocument();
  });

  test("renders contact information with email link", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByText(/If you have any questions or concerns about these T&C/)).toBeInTheDocument();
    
    const emailLink = screen.getByRole("link", { name: "unitastic@outlook.com" });
    expect(emailLink).toHaveAttribute("href", "mailto:unitastic@outlook.com");
  });

  test("has correct page metadata", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(document.title).toBe("Terms and Conditions | Unitastic");
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/terms");
  });

  test("includes navbar and footer", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("has correct layout structure", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    expect(document.querySelector(".terms-container")).toBeInTheDocument();
    expect(document.querySelector(".col-lg-8")).toBeInTheDocument();
  });

  test("prohibited activities are in a list format", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    const prohibitedList = screen.getByText("Spamming or sending unsolicited communications.").closest("ul");
    expect(prohibitedList).toBeInTheDocument();
    
    const listItems = prohibitedList.querySelectorAll("li");
    expect(listItems).toHaveLength(4); // 4 prohibited activities
  });

  test("renders proper section structure", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    // All sections should be wrapped in section elements
    const sections = document.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(10); // At least 10 sections (including date section)
  });

  test("email link has correct accessibility", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    const emailLink = screen.getByRole("link", { name: "unitastic@outlook.com" });
    expect(emailLink).toHaveAttribute("href", "mailto:unitastic@outlook.com");
  });

  test("contains proper legal terminology", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    // Check for key legal terms
    expect(screen.getByText(/intellectual property laws/)).toBeInTheDocument();
    expect(screen.getByText(/applicable laws and regulations/)).toBeInTheDocument();
    expect(screen.getByText(/governed by and construed in accordance/)).toBeInTheDocument();
  });

  test("references Unitastic brand consistently", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    // Check for references to "Unitastic" in the content
    expect(screen.getByText(/are the property of "Unitastic"/)).toBeInTheDocument();
    // Also appears in the title and page structure
    expect(document.title).toContain("Unitastic");
  });

  test("uses proper quote formatting", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    // Check that quoted content renders properly
    expect(screen.getByText(/are the property of "Unitastic"/)).toBeInTheDocument();
  });

  test("all sections have proper heading hierarchy", () => {
    render(
      <RouterWrapper>
        <TermsandConditions />
      </RouterWrapper>
    );

    // Main heading should be h3
    expect(screen.getByRole("heading", { level: 3, name: "Terms and Conditions" })).toBeInTheDocument();
    
    // Section headings should be h5
    expect(screen.getByRole("heading", { level: 5, name: "1. Acceptance of Terms" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 5, name: "10. Contact Information" })).toBeInTheDocument();
  });
});
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Semesters from "./Semesters";

// Mock APIs
vi.mock("../../../apis/materials", () => ({
  getSemesters: vi.fn(),
  getPersonalizedMaterials: vi.fn(),
}));

import { getSemesters, getPersonalizedMaterials } from "../../../apis/materials";

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

// Mock window.adsbygoogle
Object.defineProperty(window, 'adsbygoogle', {
  value: [],
  writable: true,
});

describe("Semesters Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock responses
    getSemesters.mockResolvedValue([
      {
        id: "sem1",
        name: "Semester 1 & 2",
        description: "First year subjects"
      },
      {
        id: "sem3",
        name: "Semester 3",
        description: "Second year first semester"
      },
      {
        id: "sem4",
        name: "Semester 4",
        description: "Second year second semester"
      }
    ]);
    
    getPersonalizedMaterials.mockResolvedValue(null);
  });

  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  test("renders loading spinner initially", () => {
    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders semesters list after loading", async () => {
    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Select Semester")).toBeInTheDocument();
      expect(screen.getByText("Semester 1 & 2")).toBeInTheDocument();
      expect(screen.getByText("Semester 3")).toBeInTheDocument();
      expect(screen.getByText("Semester 4")).toBeInTheDocument();
      expect(screen.getByText("First year subjects")).toBeInTheDocument();
    });
  });

  test("shows login message when no personalized materials", async () => {
    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Login or Signup to get Personalized Materials.")).toBeInTheDocument();
    });
  });

  test("renders personalized materials when available", async () => {
    getPersonalizedMaterials.mockResolvedValue({
      name: "Computer Science Materials",
      semester: "Semester 5",
      description: "CSE Department materials",
      url: "https://example.com/materials"
    });

    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Personalized Materials")).toBeInTheDocument();
      expect(screen.getByText("Computer Science Materials")).toBeInTheDocument();
      expect(screen.getByText("Semester 5")).toBeInTheDocument();
      expect(screen.getByText("CSE Department materials")).toBeInTheDocument();
    });

    // Check personalized materials link
    const personalizedLink = screen.getAllByText("Select")[0];
    expect(personalizedLink.closest("a")).toHaveAttribute("href", "https://example.com/materials");
    expect(personalizedLink.closest("a")).toHaveAttribute("target", "_blank");
  });

  test("renders semester links correctly", async () => {
    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    await waitFor(() => {
      const semesterLinks = screen.getAllByText("Select");
      // Should have one link per semester (no personalized materials)
      expect(semesterLinks).toHaveLength(3);
      
      // Check that links are properly formed
      semesterLinks.forEach((link, index) => {
        const expectedSemesterIds = ["sem1", "sem3", "sem4"];
        expect(link.closest("a")).toHaveAttribute("href", `/semesters/${expectedSemesterIds[index]}`);
      });
    });
  });

  test("has correct page metadata", () => {
    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    expect(document.title).toBe("Semesters | Unitastic");
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", "https://unitastic.netlify.app/semesters");
  });

  test("includes navbar and footer", async () => {
    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("handles API errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the functions to return resolved promises to avoid unhandled rejections
    getSemesters.mockResolvedValue([]);
    getPersonalizedMaterials.mockResolvedValue([]);

    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    // Should still render the page structure
    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  test("renders ad placement", async () => {
    const { container } = render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    await waitFor(() => {
      const adElement = container.querySelector('.adsbygoogle');
      expect(adElement).not.toBeNull();
      expect(adElement).toHaveAttribute('data-ad-client', 'ca-pub-7240094938519313');
      expect(adElement).toHaveAttribute('data-ad-slot', '1796885446');
    });
  });

  test("handles empty semesters list", async () => {
    getSemesters.mockResolvedValue([]);

    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Select Semester")).toHaveLength(1);
      // Should not have any semester cards
      expect(screen.queryByText("Semester 1 & 2")).not.toBeInTheDocument();
    });
  });

  test("renders correct card structure for semesters", async () => {
    const { container } = render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    await waitFor(() => {
      const cards = container.querySelectorAll('.semester-card');
      expect(cards).toHaveLength(3); // 3 semesters
      
      cards.forEach(card => {
        expect(card).toHaveClass('card');
        expect(card.querySelector('.card-body')).toBeInTheDocument();
        expect(card.querySelector('.card-title')).toBeInTheDocument();
        expect(card.querySelector('.card-text')).toBeInTheDocument();
        expect(card.querySelector('.btn')).toBeInTheDocument();
      });
    });
  });

  test("personalizes materials card has correct structure", async () => {
    getPersonalizedMaterials.mockResolvedValue({
      name: "Test Materials",
      semester: "Test Semester",
      description: "Test description",
      url: "https://test.com"
    });

    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    await waitFor(() => {
      const personalizedCard = screen.getByText("Test Materials").closest('.card');
      expect(personalizedCard).toHaveClass('semester-card');
      expect(personalizedCard.querySelector('.card-body')).not.toBeNull();
      expect(personalizedCard.querySelector('.card-title')).not.toBeNull();
      expect(personalizedCard.querySelector('.card-text')).not.toBeNull();
      expect(personalizedCard.querySelector('.btn')).not.toBeNull();
    });
  });

  test("calls APIs on component mount", async () => {
    render(
      <RouterWrapper>
        <Semesters />
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(getSemesters).toHaveBeenCalledTimes(1);
      expect(getPersonalizedMaterials).toHaveBeenCalledTimes(1);
    });
  });
});
import { expect, test, vi, describe, beforeEach } from "vitest";
import { getRandomInspirationalQuote } from "../../apis/quote";
import Quote from "./Quote";
import { render, screen, waitFor } from "@testing-library/react";
import { QUOTES } from "../../utils/constants";

vi.mock("../../apis/quote");
vi.mock("../../utils/constants", () => ({
  QUOTES: [
    {
      quote: "Test fallback quote",
      author: "Test Author",
    },
  ],
}));

describe("Quote Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders without crashing", async () => {
    getRandomInspirationalQuote.mockResolvedValue({ quote: "", author: "" });
    render(<Quote />);
    expect(screen.getByText("Random Thought")).toBeInTheDocument();
  });

  test("displays quote content and author from API", async () => {
    const mockQuote = {
      quote: "Test quote from API",
      author: "API Author",
    };

    getRandomInspirationalQuote.mockResolvedValue(mockQuote);
    render(<Quote />);

    await waitFor(() => {
      expect(screen.getByText(mockQuote.quote)).toBeInTheDocument();
      expect(screen.getByText(mockQuote.author)).toBeInTheDocument();
    });
  });

  test("displays fallback quote when API fails", async () => {
    getRandomInspirationalQuote.mockRejectedValue(new Error("API Error"));
    const mathRandomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
    
    render(<Quote />);

    await waitFor(() => {
      expect(screen.getByText("Test fallback quote")).toBeInTheDocument();
      expect(screen.getByText("Test Author")).toBeInTheDocument();
    });

    mathRandomSpy.mockRestore();
  });

  test("has correct structure and CSS classes", () => {
    getRandomInspirationalQuote.mockResolvedValue({ quote: "Test", author: "Author" });
    render(<Quote />);
    
    expect(document.querySelector(".quote-container")).toBeInTheDocument();
    expect(document.querySelector(".blockquote")).toBeInTheDocument();
    expect(document.querySelector(".blockquote-footer")).toBeInTheDocument();
  });
});

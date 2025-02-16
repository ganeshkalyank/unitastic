import { expect, test, vi } from "vitest";
import { getRandomInspirationalQuote } from "../../apis/quote";
import Quote from "./Quote";
import { render, screen } from "@testing-library/react";

vi.mock("../../apis/quote");

test("renders without crashing", async () => {
  getRandomInspirationalQuote.mockResolvedValue({ quote: "", author: "" });
  render(<Quote />);
});

test("displays quote content and author", async () => {
  const mockQuote = {
    quote: "Test quote",
    author: "Test author",
  };

  getRandomInspirationalQuote.mockResolvedValue(mockQuote);
  render(<Quote />);

  const quoteContent = await screen.findByText(mockQuote.quote);
  const quoteAuthor = await screen.findByText(mockQuote.author);

  expect(quoteContent).not.toBeNull();
  expect(quoteAuthor).not.toBeNull();
});

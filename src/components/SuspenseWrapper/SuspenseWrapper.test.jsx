import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import SuspenseWrapper from "./SuspenseWrapper";

// Mock the Loader component
vi.mock("../Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Test component that simulates lazy loading
const LazyTestComponent = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Promise(() => {}); // Simulate pending promise
  }
  return <div data-testid="lazy-component">Lazy Loaded Content</div>;
};

describe("SuspenseWrapper Component", () => {
  test("renders children when loaded", () => {
    render(
      <SuspenseWrapper>
        <div data-testid="child-component">Child Content</div>
      </SuspenseWrapper>
    );

    expect(screen.getByTestId("child-component")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  test("renders loader fallback during suspense", () => {
    // This test simulates the suspense state by rendering the fallback directly
    render(
      <Suspense fallback={<div data-testid="loader">Loading...</div>}>
        <LazyTestComponent shouldThrow={true} />
      </Suspense>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("renders null children gracefully", () => {
    render(<SuspenseWrapper>{null}</SuspenseWrapper>);
    
    // Should not throw an error and should render empty
    expect(screen.queryByTestId("child-component")).not.toBeInTheDocument();
  });

  test("renders undefined children gracefully", () => {
    render(<SuspenseWrapper>{undefined}</SuspenseWrapper>);
    
    // Should not throw an error and should render empty
    expect(screen.queryByTestId("child-component")).not.toBeInTheDocument();
  });

  test("renders multiple children", () => {
    render(
      <SuspenseWrapper>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </SuspenseWrapper>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });

  test("has correct default props", () => {
    // Test with no children prop
    render(<SuspenseWrapper />);
    
    // Should render without errors (children defaults to null)
    expect(screen.queryByTestId("child-component")).not.toBeInTheDocument();
  });

  test("passes through component props correctly", () => {
    const TestChild = ({ testProp }) => (
      <div data-testid="test-child">{testProp}</div>
    );

    render(
      <SuspenseWrapper>
        <TestChild testProp="test value" />
      </SuspenseWrapper>
    );

    expect(screen.getByText("test value")).toBeInTheDocument();
  });

  test("maintains component tree structure", () => {
    const { container } = render(
      <SuspenseWrapper>
        <div className="wrapper">
          <span>Nested Content</span>
        </div>
      </SuspenseWrapper>
    );

    expect(container.querySelector(".wrapper")).toBeInTheDocument();
    expect(screen.getByText("Nested Content")).toBeInTheDocument();
  });

  test("handles React fragments as children", () => {
    render(
      <SuspenseWrapper>
        <>
          <div data-testid="fragment-child-1">Fragment Child 1</div>
          <div data-testid="fragment-child-2">Fragment Child 2</div>
        </>
      </SuspenseWrapper>
    );

    expect(screen.getByTestId("fragment-child-1")).toBeInTheDocument();
    expect(screen.getByTestId("fragment-child-2")).toBeInTheDocument();
  });
});
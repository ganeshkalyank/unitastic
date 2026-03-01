import {
  calculateCGPA,
  calculateCanBunk,
  calculateExternals,
  calculateSGPA,
  calculateSGPAForCGPA,
} from "./calculators";
import { expect, test, describe, vi, beforeEach } from "vitest";

// Mock Firebase analytics
vi.mock("../firebase", () => ({
  analytics: {},
}));

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
}));

describe("Calculator Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("calculateExternals", () => {
    test("calculates externals for valid internal marks", () => {
      expect(calculateExternals(46)).toEqual({
        S: 90,
        "A+": 80,
        A: 58,
        B: 40,
        C: 18,
        D: 8,
      });
      expect(calculateExternals(50)).toEqual({
        S: 82,
        "A+": 72,
        A: 50,
        B: 32,
        C: 10,
        D: 0,
      });
    });

    test("returns NA for internals above 50", () => {
      expect(calculateExternals(51)).toEqual({
        S: "NA",
        "A+": "NA",
        A: "NA",
        B: "NA",
        C: "NA",
        D: "NA",
      });
      expect(calculateExternals(100)).toEqual({
        S: "NA",
        "A+": "NA",
        A: "NA",
        B: "NA",
        C: "NA",
        D: "NA",
      });
    });

    test("handles edge cases", () => {
      expect(calculateExternals(0)).toEqual({
        S: 182,
        "A+": 172,
        A: 150,
        B: 132,
        C: 110,
        D: 100,
      });
      expect(calculateExternals(25)).toEqual({
        S: 132,
        "A+": 122,
        A: 100,
        B: 82,
        C: 60,
        D: 50,
      });
    });
  });

  describe("calculateCanBunk", () => {
    test("calculates bunkable classes correctly", () => {
      expect(calculateCanBunk(4, 0)).toBe(12);
      expect(calculateCanBunk(3, 1)).toBe(8);
      expect(calculateCanBunk(2, 2)).toBe(4);
    });

    test("handles edge cases", () => {
      expect(calculateCanBunk(1, 0)).toBe(3);
      expect(calculateCanBunk(4, 12)).toBe(0);
      expect(calculateCanBunk(4, 15)).toBe(-3); // Already bunked too much
    });

    test("handles zero credits", () => {
      expect(calculateCanBunk(0, 0)).toBe(0);
    });
  });

  describe("calculateCGPA", () => {
    test("calculates CGPA correctly", () => {
      expect(
        calculateCGPA([
          { sgpa: 9.8, credits: 4 },
          { sgpa: 9.4, credits: 3 },
        ]).toFixed(4),
      ).toBe("9.6286");
    });

    test("handles zero SGPA", () => {
      expect(
        calculateCGPA([
          { sgpa: 0, credits: 4 },
          { sgpa: 0, credits: 5 },
          { sgpa: 0, credits: 7 },
        ]).toFixed(4),
      ).toBe("0.0000");
    });

    test("handles perfect SGPA", () => {
      expect(
        calculateCGPA([
          { sgpa: 10, credits: 4 },
          { sgpa: 10, credits: 3 },
          { sgpa: 10, credits: 3 },
        ]).toFixed(4),
      ).toBe("10.0000");
    });

    test("handles single semester", () => {
      expect(
        calculateCGPA([{ sgpa: 8.5, credits: 20 }]).toFixed(4),
      ).toBe("8.5000");
    });

    test("handles string inputs (simulating form data)", () => {
      expect(
        calculateCGPA([
          { sgpa: "9.8", credits: "4" },
          { sgpa: "9.4", credits: "3" },
        ]).toFixed(4),
      ).toBe("9.6286");
    });
  });

  describe("calculateSGPA", () => {
    test("calculates SGPA correctly", () => {
      expect(
        calculateSGPA([
          { grade: "S", credits: 4 },
          { grade: "A+", credits: 3 },
        ]).toFixed(4),
      ).toBe("9.5714");
    });

    test("handles all failing grades", () => {
      expect(
        calculateSGPA([
          { grade: "F", credits: 4 },
          { grade: "F", credits: 5 },
          { grade: "F", credits: 7 },
        ]).toFixed(4),
      ).toBe("0.0000");
    });

    test("handles all S grades", () => {
      expect(
        calculateSGPA([
          { grade: "S", credits: 4 },
          { grade: "S", credits: 3 },
          { grade: "S", credits: 3 },
        ]).toFixed(4),
      ).toBe("10.0000");
    });

    test("handles all grade types", () => {
      expect(
        calculateSGPA([
          { grade: "S", credits: 1 },
          { grade: "A+", credits: 1 },
          { grade: "A", credits: 1 },
          { grade: "B", credits: 1 },
          { grade: "C", credits: 1 },
          { grade: "D", credits: 1 },
          { grade: "F", credits: 1 },
        ]).toFixed(4),
      ).toBe("6.4286");
    });

    test("handles string credits (simulating form data)", () => {
      expect(
        calculateSGPA([
          { grade: "S", credits: "4" },
          { grade: "A+", credits: "3" },
        ]).toFixed(4),
      ).toBe("9.5714");
    });
  });

  describe("calculateSGPAForCGPA", () => {
    test("calculates required SGPA correctly", () => {
      expect(calculateSGPAForCGPA(9.5, 24, 81, 9.4).toFixed(4)).toBe("9.8375");
      expect(calculateSGPAForCGPA(9.1, 24, 92, 8.97).toFixed(4)).toBe("9.5983");
      expect(calculateSGPAForCGPA(7.5, 21, 83, 6.9).toFixed(4)).toBe("9.8714");
    });

    test("handles impossible CGPA goals", () => {
      // When target CGPA is lower than current
      expect(calculateSGPAForCGPA(8.0, 24, 81, 9.0).toFixed(4)).toBe("4.6250");
      
      // When target CGPA requires negative SGPA
      const result = calculateSGPAForCGPA(5.0, 24, 81, 9.0);
      expect(result).toBeLessThan(0);
    });

    test("handles edge cases", () => {
      // Perfect scores
      expect(calculateSGPAForCGPA(10.0, 24, 81, 10.0).toFixed(4)).toBe("10.0000");
      
      // Zero current CGPA - this would require an impossibly high SGPA
      expect(calculateSGPAForCGPA(8.0, 24, 81, 0.0).toFixed(4)).toBe("35.0000");
    });
  });
});

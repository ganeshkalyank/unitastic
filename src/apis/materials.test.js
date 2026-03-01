import { describe, test, expect, vi, beforeEach } from "vitest";
import { getSemesters, getPersonalizedMaterials } from "./materials";

// Mock Firebase
vi.mock("../firebase", () => ({
  db: {},
  auth: {
    currentUser: null,
  },
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  orderBy, 
  query, 
  where 
} from "firebase/firestore";
import { auth } from "../firebase";

describe("Materials API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSemesters", () => {
    test("successfully fetches semesters", async () => {
      const mockSemesters = [
        {
          id: "sem1",
          name: "Semester 1 & 2",
          description: "First year materials",
        },
        {
          id: "sem3",
          name: "Semester 3",
          description: "Third semester materials",
        },
      ];

      const mockSnapshot = {
        docs: mockSemesters.map((semester) => ({
          data: () => ({ name: semester.name, description: semester.description }),
          id: semester.id,
        })),
      };

      collection.mockReturnValue("mockCollection");
      orderBy.mockReturnValue("mockOrderBy");
      query.mockReturnValue("mockQuery");
      getDocs.mockResolvedValue(mockSnapshot);

      const result = await getSemesters();

      expect(collection).toHaveBeenCalledWith({}, "semesters");
      expect(orderBy).toHaveBeenCalledWith("name");
      expect(query).toHaveBeenCalledWith("mockCollection", "mockOrderBy");
      expect(getDocs).toHaveBeenCalledWith("mockQuery");
      expect(result).toEqual(mockSemesters);
    });

    test("handles empty semesters collection", async () => {
      const mockSnapshot = { docs: [] };
      
      collection.mockReturnValue("mockCollection");
      orderBy.mockReturnValue("mockOrderBy");
      query.mockReturnValue("mockQuery");
      getDocs.mockResolvedValue(mockSnapshot);

      const result = await getSemesters();

      expect(result).toEqual([]);
    });

    test("handles firestore error", async () => {
      collection.mockReturnValue("mockCollection");
      orderBy.mockReturnValue("mockOrderBy");
      query.mockReturnValue("mockQuery");
      getDocs.mockRejectedValue(new Error("Firestore error"));

      await expect(getSemesters()).rejects.toThrow("Firestore error");
    });
  });

  describe("getPersonalizedMaterials", () => {
    test("returns null when user is not logged in", async () => {
      auth.currentUser = null;

      const result = await getPersonalizedMaterials();

      expect(result).toBeNull();
    });

    test("returns email verification message when email not verified", async () => {
      auth.currentUser = {
        uid: "user123",
        emailVerified: false,
      };

      const result = await getPersonalizedMaterials();

      expect(result).toEqual({
        name: "Verify your email",
        description: "You haven't verified your email. Please verify your email to access your personalized materials.",
        url: "/profile",
      });
    });

    test("returns first year materials for Semester 1 & 2", async () => {
      auth.currentUser = {
        uid: "user123",
        emailVerified: true,
      };

      const mockUserData = {
        exists: () => true,
        data: () => ({
          semester: "Semester 1 & 2",
          department: "All Departments",
        }),
      };

      doc.mockReturnValue("mockDoc");
      getDoc.mockResolvedValue(mockUserData);

      const result = await getPersonalizedMaterials();

      expect(doc).toHaveBeenCalledWith({}, "users", "user123");
      expect(getDoc).toHaveBeenCalledWith("mockDoc");
      expect(result).toEqual({
        name: "All Departments",
        description: "1st year materials for both Group A & Group B",
        url: "/semesters/fE8kQXlfVFbD9SpU25Qt",
        semester: "Semester 1 & 2",
      });
    });

    test("returns department-specific materials for higher semesters", async () => {
      auth.currentUser = {
        uid: "user123",
        emailVerified: true,
      };

      const mockUserData = {
        exists: () => true,
        data: () => ({
          semester: "Semester 5",
          department: "Computer Science and Engineering",
        }),
      };

      const mockSemesterSnapshot = {
        docs: [{ id: "sem5" }],
      };

      const mockDepartmentSnapshot = {
        docs: [{
          data: () => ({
            name: "Computer Science and Engineering",
            description: "CSE Department materials",
            url: "/materials/cse",
          }),
        }],
      };

      doc.mockReturnValue("mockDoc");
      getDoc.mockResolvedValue(mockUserData);
      collection.mockReturnValue("mockCollection");
      query.mockReturnValue("mockQuery");
      where.mockReturnValue("mockWhere");
      getDocs
        .mockResolvedValueOnce(mockSemesterSnapshot)
        .mockResolvedValueOnce(mockDepartmentSnapshot);

      const result = await getPersonalizedMaterials();

      expect(result).toEqual({
        name: "Computer Science and Engineering",
        description: "CSE Department materials",
        url: "/materials/cse",
        semester: "Semester 5",
      });
    });

    test("handles error when user data not found", async () => {
      auth.currentUser = {
        uid: "user123",
        emailVerified: true,
      };

      doc.mockReturnValue("mockDoc");
      getDoc.mockRejectedValue(new Error("User not found"));

      const result = await getPersonalizedMaterials();

      expect(result).toEqual({
        name: "Materials unvailable.",
        description: "You haven't set your department and semester in profile or materials are not available yet. Use the following button to set your department and semester.",
        url: "/profile",
      });
    });

    test("handles error when department not found", async () => {
      auth.currentUser = {
        uid: "user123",
        emailVerified: true,
      };

      const mockUserData = {
        exists: () => true,
        data: () => ({
          semester: "Semester 5",
          department: "Non-existent Department",
        }),
      };

      const mockSemesterSnapshot = {
        docs: [{ id: "sem5" }],
      };

      const mockDepartmentSnapshot = {
        docs: [], // Empty - department not found
      };

      doc.mockReturnValue("mockDoc");
      getDoc.mockResolvedValue(mockUserData);
      collection.mockReturnValue("mockCollection");
      query.mockReturnValue("mockQuery");
      where.mockReturnValue("mockWhere");
      getDocs
        .mockResolvedValueOnce(mockSemesterSnapshot)
        .mockResolvedValueOnce(mockDepartmentSnapshot);

      // This should throw an error when trying to access docs[0]
      await expect(getPersonalizedMaterials()).resolves.toEqual({
        name: "Materials unvailable.",
        description: "You haven't set your department and semester in profile or materials are not available yet. Use the following button to set your department and semester.",
        url: "/profile",
      });
    });
  });
});
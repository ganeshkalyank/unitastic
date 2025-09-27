import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonalDetails from "./PersonalDetails";

// Mock Firebase Auth
const mockAuth = {
  currentUser: {
    uid: "test-uid",
    displayName: "Test User",
    email: "test@example.com",
    emailVerified: true,
  },
};

vi.mock("firebase/auth", () => {
  const mockOnAuthStateChanged = vi.fn();
  const mockUpdateProfile = vi.fn();
  const mockSendEmailVerification = vi.fn();
  
  return {
    onAuthStateChanged: mockOnAuthStateChanged,
    updateProfile: mockUpdateProfile,
    sendEmailVerification: mockSendEmailVerification,
  };
});

// Mock Firebase Firestore
vi.mock("firebase/firestore", () => {
  const mockGetDoc = vi.fn();
  const mockSetDoc = vi.fn();
  const mockDoc = vi.fn();
  
  return {
    getDoc: mockGetDoc,
    setDoc: mockSetDoc,
    doc: mockDoc,
  };
});

// Mock Firebase config
vi.mock("../../../firebase", () => ({
  auth: mockAuth,
  db: {},
}));

// Import mocked functions
import { onAuthStateChanged, updateProfile, sendEmailVerification } from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";

const mockedOnAuthStateChanged = vi.mocked(onAuthStateChanged);
const mockedUpdateProfile = vi.mocked(updateProfile);
const mockedSendEmailVerification = vi.mocked(sendEmailVerification);
const mockedGetDoc = vi.mocked(getDoc);
const mockedSetDoc = vi.mocked(setDoc);
const mockedDoc = vi.mocked(doc);

describe("PersonalDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default auth state
    mockedOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockAuth.currentUser);
      return () => {}; // Unsubscribe function
    });

    // Setup default Firestore response
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        semester: "Semester 5",
        department: "Computer Science and Engineering",
      }),
    });

    mockDoc.mockReturnValue({ id: "test-doc" });
    mockUpdateProfile.mockResolvedValue();
    mockSetDoc.mockResolvedValue();
  });

  test("renders personal details form with user data", async () => {
    render(<PersonalDetails />);

    expect(screen.getByText("Personal Details")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Semester 5")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Computer Science and Engineering")).toBeInTheDocument();
    });
  });

  test("shows email verified status when email is verified", async () => {
    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByText("Email Verified.")).toBeInTheDocument();
    });
  });

  test("shows email not verified status with resend link", async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({
        ...mockAuth.currentUser,
        emailVerified: false,
      });
      return () => {};
    });

    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByText("Email Not Verified.")).toBeInTheDocument();
      expect(screen.getByText("Resend confirmation mail")).toBeInTheDocument();
    });
  });

  test("handles resend confirmation mail successfully", async () => {
    const user = userEvent.setup();
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({
        ...mockAuth.currentUser,
        emailVerified: false,
      });
      return () => {};
    });

    mockSendEmailVerification.mockResolvedValue();

    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByText("Resend confirmation mail")).toBeInTheDocument();
    });

    const resendLink = screen.getByText("Resend confirmation mail");
    await user.click(resendLink);

    await waitFor(() => {
      expect(mockSendEmailVerification).toHaveBeenCalledWith(mockAuth.currentUser);
      expect(screen.getByText("Confirmation mail sent. Please check your inbox.")).toBeInTheDocument();
    });
  });

  test("handles resend confirmation mail error", async () => {
    const user = userEvent.setup();
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({
        ...mockAuth.currentUser,
        emailVerified: false,
      });
      return () => {};
    });

    mockSendEmailVerification.mockRejectedValue(new Error("Network error"));

    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByText("Resend confirmation mail")).toBeInTheDocument();
    });

    const resendLink = screen.getByText("Resend confirmation mail");
    await user.click(resendLink);

    await waitFor(() => {
      expect(screen.getByText("Error sending confirmation mail.")).toBeInTheDocument();
    });
  });

  test("enables editing mode when Edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: "Edit" });
    await user.click(editButton);

    // Name input should be enabled for editing
    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).not.toBeDisabled();
    
    // Semester and department selects should be enabled
    const semesterSelect = screen.getByLabelText("Semester");
    const departmentSelect = screen.getByLabelText("Department");
    expect(semesterSelect).not.toBeDisabled();
    expect(departmentSelect).not.toBeDisabled();

    // Button text should change to "Save"
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  test("saves changes when Save button is clicked", async () => {
    const user = userEvent.setup();
    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: "Edit" });
    await user.click(editButton);

    // Modify name
    const nameInput = screen.getByLabelText("Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Name");

    // Modify semester
    const semesterSelect = screen.getByLabelText("Semester");
    await user.selectOptions(semesterSelect, "Semester 6");

    // Save changes
    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockAuth.currentUser, {
        displayName: "Updated Name",
      });
      expect(mockSetDoc).toHaveBeenCalledWith(
        { id: "test-doc" },
        {
          semester: "Semester 6",
          department: "Computer Science and Engineering",
        },
        { merge: true }
      );
    });

    // Should return to view mode
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  test("handles user without Firestore data", async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });

    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    });

    // Semester and department should be empty
    const semesterSelect = screen.getByLabelText("Semester");
    const departmentSelect = screen.getByLabelText("Department");
    expect(semesterSelect.value).toBe("");
    expect(departmentSelect.value).toBe("");
  });

  test("handles auth state change with no user", () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(<PersonalDetails />);

    // Should render empty form when no user
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
  });

  test("disables inputs properly in view mode", async () => {
    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const semesterSelect = screen.getByLabelText("Semester");
    const departmentSelect = screen.getByLabelText("Department");

    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled(); // Email should always be disabled
    expect(semesterSelect).toBeDisabled();
    expect(departmentSelect).toBeDisabled();
  });

  test("has all semester options available", async () => {
    const user = userEvent.setup();
    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: "Edit" });
    await user.click(editButton);

    const semesterSelect = screen.getByLabelText("Semester");
    const semesterOptions = [
      "Select",
      "Semester 1 & 2",
      "Semester 3",
      "Semester 4", 
      "Semester 5",
      "Semester 6",
      "Semester 7",
      "Semester 8",
      "Semester 9",
      "Semester 10"
    ];

    semesterOptions.forEach(option => {
      expect(screen.getByRole("option", { name: option })).toBeInTheDocument();
    });
  });

  test("has all department options available", async () => {
    const user = userEvent.setup();
    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: "Edit" });
    await user.click(editButton);

    // Check some key department options
    expect(screen.getByRole("option", { name: "Computer Science and Engineering" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Mechanical Engineering" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Electrical and Electronics Engineering" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Civil Engineering" })).toBeInTheDocument();
  });

  test("button is disabled during save operation", async () => {
    const user = userEvent.setup();
    // Make updateProfile slow to test disabled state
    mockUpdateProfile.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<PersonalDetails />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: "Edit" });
    await user.click(editButton);

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    // Button should be disabled during save
    expect(saveButton).toBeDisabled();
  });
});
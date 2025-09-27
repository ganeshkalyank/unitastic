import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangePassword from "./ChangePassword";

// Mock Firebase Auth
const mockAuth = {
  currentUser: {
    email: "test@example.com",
  },
};

vi.mock("firebase/auth", () => {
  const mockEmailAuthProvider = vi.fn();
  const mockReauthenticateWithCredential = vi.fn();
  const mockUpdatePassword = vi.fn();
  
  return {
    EmailAuthProvider: {
      credential: mockEmailAuthProvider,
    },
    reauthenticateWithCredential: mockReauthenticateWithCredential,
    updatePassword: mockUpdatePassword,
  };
});

// Mock Firebase config
vi.mock("../../../firebase", () => ({
  auth: mockAuth,
}));

// Import mocked functions
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const mockedEmailAuthProvider = vi.mocked(EmailAuthProvider);
const mockedReauthenticateWithCredential = vi.mocked(reauthenticateWithCredential);
const mockedUpdatePassword = vi.mocked(updatePassword);

describe("ChangePassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedEmailAuthProvider.credential.mockReturnValue({ email: "test@example.com", password: "oldpass" });
    mockedReauthenticateWithCredential.mockResolvedValue();
    mockedUpdatePassword.mockResolvedValue();
  });

  test("renders change password form", () => {
    render(<ChangePassword />);

    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Old Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change Password" })).toBeInTheDocument();
  });

  test("changes password successfully", async () => {
    const user = userEvent.setup();
    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Change Password" });

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmPasswordInput, "newpassword123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedEmailAuthProvider.credential).toHaveBeenCalledWith("test@example.com", "oldpassword");
      expect(mockedReauthenticateWithCredential).toHaveBeenCalledWith(
        mockAuth.currentUser,
        { email: "test@example.com", password: "oldpass" }
      );
      expect(mockedUpdatePassword).toHaveBeenCalledWith(mockAuth.currentUser, "newpassword123");
      expect(screen.getByText("Password changed successfully.")).toBeInTheDocument();
    });
  });

  test("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Change Password" });

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmPasswordInput, "differentpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
      expect(mockedReauthenticateWithCredential).not.toHaveBeenCalled();
      expect(mockedUpdatePassword).not.toHaveBeenCalled();
    });
  });

  test("handles wrong password error", async () => {
    const user = userEvent.setup();
    const wrongPasswordError = new Error("Wrong password");
    wrongPasswordError.code = "auth/wrong-password";
    mockedReauthenticateWithCredential.mockRejectedValue(wrongPasswordError);

    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Change Password" });

    await user.type(oldPasswordInput, "wrongpassword");
    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmPasswordInput, "newpassword123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Wrong password.")).toBeInTheDocument();
    });
  });

  test("handles weak password error", async () => {
    const user = userEvent.setup();
    const weakPasswordError = new Error("Weak password");
    weakPasswordError.code = "auth/weak-password";
    mockedUpdatePassword.mockRejectedValue(weakPasswordError);

    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Change Password" });

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "weak");
    await user.type(confirmPasswordInput, "weak");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Weak password.")).toBeInTheDocument();
    });
  });

  test("handles generic error", async () => {
    const user = userEvent.setup();
    const genericError = new Error("Network error");
    genericError.code = "auth/network-error";
    mockedReauthenticateWithCredential.mockRejectedValue(genericError);

    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Change Password" });

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmPasswordInput, "newpassword123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("An error occurred. Please try again later.")).toBeInTheDocument();
    });
  });

  test("disables submit button during submission", async () => {
    const user = userEvent.setup();
    // Make the authentication slow to test disabled state
    mockedReauthenticateWithCredential.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Change Password" });

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmPasswordInput, "newpassword123");
    await user.click(submitButton);

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();
  });

  test("clears response message on new submission", async () => {
    const user = userEvent.setup();
    render(<ChangePassword />);

    // First submission with error
    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Change Password" });

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmPasswordInput, "differentpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });

    // Clear and try again
    await user.clear(confirmPasswordInput);
    await user.type(confirmPasswordInput, "newpassword123");
    await user.click(submitButton);

    // Response should be cleared initially, then show success
    await waitFor(() => {
      expect(screen.getByText("Password changed successfully.")).toBeInTheDocument();
      expect(screen.queryByText("Passwords do not match.")).not.toBeInTheDocument();
    });
  });

  test("requires all password fields", () => {
    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    expect(oldPasswordInput).toBeRequired();
    expect(newPasswordInput).toBeRequired();
    expect(confirmPasswordInput).toBeRequired();
  });

  test("password inputs have correct type", () => {
    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    expect(oldPasswordInput).toHaveAttribute("type", "password");
    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });

  test("form submits on enter key", async () => {
    const user = userEvent.setup();
    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmPasswordInput, "newpassword123");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockedReauthenticateWithCredential).toHaveBeenCalled();
      expect(mockedUpdatePassword).toHaveBeenCalled();
    });
  });

  test("handles reauthentication failure during password update", async () => {
    const user = userEvent.setup();
    const authError = new Error("Reauthentication failed");
    authError.code = "auth/requires-recent-login";
    mockedUpdatePassword.mockRejectedValue(authError);

    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Change Password" });

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmPasswordInput, "newpassword123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("An error occurred. Please try again later.")).toBeInTheDocument();
    });
  });
});
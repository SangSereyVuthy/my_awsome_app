// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, beforeEach } from "vitest";
import { UserProfile } from "./components/UserProfile";

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe("Session Restore Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restores user session automatically when valid token exists", async () => {
    localStorage.setItem("token", "mocked-jwt-token-xyz");

    renderWithClient(<UserProfile />);

    // ✅ Match តាម Heading "Welcome, Sopheak!"
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /welcome, sopheak/i })
      ).toBeInTheDocument();
    });
  });
});
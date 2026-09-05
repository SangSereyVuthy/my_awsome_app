// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "../../mocks/server";
import { UserProfile } from "./components/UserProfile";

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe("Logout Integration Tests (MSW)", () => {
  // ✅ ត្រូវប្រាកដថានៅត្រង់នេះមានពាក្យ 'async'
  it("logs out successfully and triggers callback", async () => {
    const user = userEvent.setup();
    const handleLogoutSuccess = vi.fn();

    renderWithClient(<UserProfile onLogoutSuccess={handleLogoutSuccess} />);

    const logoutBtn = screen.getByRole("button", { name: /log out/i });
    await user.click(logoutBtn);

    expect(
      await screen.findByRole("button", { name: /logging out\.\.\./i })
    ).toBeDisabled();

    // ប្រើ await waitFor នៅក្នុង async function
    await waitFor(() => {
      expect(handleLogoutSuccess).toHaveBeenCalledTimes(1);
    });
  });

  // ✅ ត្រូវប្រាកដថានៅត្រង់នេះមានពាក្យ 'async'
  it("handles server error during logout gracefully", async () => {
    server.use(
      http.post("*/api/auth/logout", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const user = userEvent.setup();
    renderWithClient(<UserProfile />);

    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
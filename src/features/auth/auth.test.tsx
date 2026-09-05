// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { LoginForm } from "./components/LoginForm";

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

describe("LoginForm Integration Tests (MSW)", () => {
  it("submits the form and logs in successfully", async () => {
    const user = userEvent.setup();
    renderWithClient(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");

    await user.click(screen.getByRole("button", { name: /log in/i }));

    // ✅ ប្រើ await screen.findByRole ដើម្បីរង់ចាំ React បច្ចុប្បន្នភាព State isPending
    expect(
      await screen.findByRole("button", { name: /logging in\.\.\./i })
    ).toBeDisabled();
  });

  it("displays server error message when credentials are invalid", async () => {
    const user = userEvent.setup();
    renderWithClient(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "wrongpassword");

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      await screen.findByText("Invalid email or password.")
    ).toBeInTheDocument();
  });

  it("handles 500 server network error gracefully", async () => {
    // ត្រូវប្រើ Wildcard "*/api/auth/login" នៅត្រង់នេះ
    server.use(
      http.post("*/api/auth/login", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const user = userEvent.setup();
    renderWithClient(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("fetches user profile successfully when authenticated", async () => {
  // Override Request Header ដើម្បីក្លែងបន្លំ Token
  server.use(
    http.get("*/api/auth/me", ({ request }) => {
      return HttpResponse.json({
        id: "usr_123",
        email: "user@example.com",
        name: "Sopheak Dev",
      });
    })
  );

  // Call hook ឬ component ដែលប្រើ useQuery ទាញ /api/auth/me
  // ឧទាហរណ៍៖ rendering App Header ឬ User Profile Component
  });

});
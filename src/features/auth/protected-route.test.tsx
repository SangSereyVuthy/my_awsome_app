// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, beforeEach } from "vitest";
import { ProtectedRoute } from "./components/ProtectedRoute";

const renderWithRouter = (initialEntries = ["/dashboard"]) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Private Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Protected Route Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects unauthenticated user to login page", () => {
    // មិនទាន់មាន Token ក្នុង LocalStorage
    renderWithRouter(["/dashboard"]);

    // ត្រូវ Redirect មកកាន់ Login Page
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Private Dashboard")).not.toBeInTheDocument();
  });

  it("allows access to private page when user is authenticated", () => {
    // មាន Token ក្នុង LocalStorage
    localStorage.setItem("token", "mocked-jwt-token-xyz");

    renderWithRouter(["/dashboard"]);

    // ត្រូវបង្ហាញ Dashboard
    expect(screen.getByText("Private Dashboard")).toBeInTheDocument();
  });
});
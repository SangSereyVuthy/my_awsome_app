import { http, HttpResponse, delay } from "msw";

export const handlers = [
  // 1. Login Handler
  http.post("*/api/auth/login", async ({ request }) => {
    await delay(100);
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === "user@example.com" && body.password === "password123") {
      return HttpResponse.json({
        user: { id: "usr_123", email: body.email, name: "Sopheak Dev" },
        token: "mocked-jwt-token-xyz",
      });
    }

    return HttpResponse.json(
      { message: "Invalid email or password." },
      { status: 401 }
    );
  }),

  // 2. Logout Handler
  http.post("*/api/auth/logout", async () => {
    await delay(100);
    return HttpResponse.json({ message: "Logged out successfully" });
  }),

  // 3. Get Current User Handler (Session Restore)
  http.get("*/api/auth/me", async ({ request }) => {
    await delay(100);
    const authHeader = request.headers.get("Authorization");

    if (authHeader === "Bearer mocked-jwt-token-xyz") {
      return HttpResponse.json({
        id: "usr_123",
        email: "user@example.com",
        name: "Sopheak Dev",
      });
    }

    return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }),

];
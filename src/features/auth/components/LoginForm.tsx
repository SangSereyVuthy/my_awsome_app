import React, { useState } from "react";
import { z } from "zod";
import { loginSchema, LoginFormData } from "../types";

type FormErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginFormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    // 1. Zod Client Validation
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: FormErrors = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const fieldName = issue.path[0] as keyof LoginFormData;
        if (fieldName === "email" || fieldName === "password") {
          if (!formattedErrors[fieldName]) {
            formattedErrors[fieldName] = issue.message;
          }
        }
      });
      setErrors(formattedErrors);
      setIsSubmitted(false);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // 2. Async API Request to Server / MSW
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Invalid credentials or server error");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setApiError(err.message || "An unexpected error occurred");
      setIsSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "350px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

      {isSubmitted && <p style={{ color: "green", textAlign: "center" }}>✅ Login Successful!</p>}

      {apiError && (
        <div role="alert" style={{ color: "red", marginBottom: "12px", textAlign: "center", fontSize: "14px" }}>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label htmlFor="email" style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "bold" }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.email && <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="password" style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "bold" }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.password && <span style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px",
            cursor: isLoading ? "not-allowed" : "pointer",
            backgroundColor: isLoading ? "#6c757d" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
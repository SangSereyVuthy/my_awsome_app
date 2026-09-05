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
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginFormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    } else {
      setErrors({});
      setIsSubmitted(true);
    }
  };

  return (
    <div style={{ maxWidth: "350px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      {isSubmitted && <p style={{ color: "green", textAlign: "center" }}>✅ Login Successful!</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <input
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.password && <span style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>}
        </div>
        <button type="submit" style={{ padding: "10px", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}>
          Sign In
        </button>
      </form>
    </div>
  );
}
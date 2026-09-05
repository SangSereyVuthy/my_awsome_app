import { useMutation } from "@tanstack/react-query";

interface LoginCredentials {
  email?: string;
  password?: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await fetch("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      return data;
    },
  });
};
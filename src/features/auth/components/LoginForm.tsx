// src/features/auth/components/LoginForm.tsx
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
  const { register, handleSubmit } = useForm();
  const mutation = useLogin();

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" {...register("email")} />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" {...register("password")} />

      {mutation.isError && (
        <p role="alert">{mutation.error.message}</p>
      )}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
};
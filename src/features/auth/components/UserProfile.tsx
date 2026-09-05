import { useMutation } from "@tanstack/react-query";

interface UserProfileProps {
  onLogoutSuccess?: () => void;
}

export const UserProfile = ({ onLogoutSuccess }: UserProfileProps) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      if (onLogoutSuccess) onLogoutSuccess();
    },
  });

  return (
    <div>
      <h1>Welcome, Sopheak!</h1>
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
      
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
};
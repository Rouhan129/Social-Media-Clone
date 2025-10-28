// components/AuthForm.tsx
import Input from "./Input";
import Button from "./Button";
import Alert from "./Alert";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: any) => void;
  loading: boolean;
  error: string | null;
}

export default function AuthForm({ type, onSubmit, loading, error }: AuthFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    if (type === "register") {
      data.role = formData.get("role") as string;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert message={error || ""} />
      <Input label="Email" name="email" type="email" required />
      <Input label="Password" name="password" type="password" required minLength={6} />

      {type === "register" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="user"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}

      <Button type="submit" loading={loading}>
        {type === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
}
import { useForm } from "react-hook-form";
import { useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (token) return <Navigate to="/dashboard" replace />;

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
            <LogIn className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your blogs and content
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                label="Email"
                type="email"
                placeholder="admin@example.com"
                className="pl-9"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
              />
              <Mail className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                error={errors.password?.message}
                {...register("password", { required: "Password is required" })}
              />
              <Lock className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Sign in
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} iTSikhwal CMS
        </p>
      </div>
    </div>
  );
}

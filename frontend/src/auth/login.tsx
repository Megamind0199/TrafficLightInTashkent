import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";

type LoginFormInputs = {
  email: string;
  password: string;
};

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormInputs>();

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormInputs>();

  const onLogin = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.token) {
        login(result.token, () => navigate("/")); // ✅ Bu joy endi ishonchli ishlaydi
      } else {
        alert(result.message || "Login error");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormInputs) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        navigate("/");
      } else {
        alert(result.message || "Register error");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 border p-6 rounded-xl shadow bg-white">
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "login" | "register")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <form
            onSubmit={handleLoginSubmit(onLogin)}
            className="space-y-4 mt-6"
          >
            <Input
              placeholder="Email"
              {...registerLogin("email", { required: "Email is required" })}
            />
            {loginErrors.email?.message && (
              <p className="text-sm text-red-500">
                {loginErrors.email.message}
              </p>
            )}

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...registerLogin("password", {
                  required: "Password is required",
                })}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {loginErrors.password?.message && (
              <p className="text-sm text-red-500">
                {loginErrors.password.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm mt-2">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setTab("register")}
                className="text-blue-600 hover:underline"
              >
                Register here
              </button>
            </p>
          </form>
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="register">
          <form
            onSubmit={handleRegisterSubmit(onRegister)}
            className="space-y-4 mt-6"
          >
            <Input
              placeholder="Name"
              {...registerRegister("name", { required: "Name is required" })}
            />
            {registerErrors.name?.message && (
              <p className="text-sm text-red-500">
                {registerErrors.name.message}
              </p>
            )}

            <Input
              placeholder="Email"
              {...registerRegister("email", { required: "Email is required" })}
            />
            {registerErrors.email?.message && (
              <p className="text-sm text-red-500">
                {registerErrors.email.message}
              </p>
            )}

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...registerRegister("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {registerErrors.password?.message && (
              <p className="text-sm text-red-500">
                {registerErrors.password.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>

            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setTab("login")}
                className="text-blue-600 hover:underline"
              >
                Login here
              </button>
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

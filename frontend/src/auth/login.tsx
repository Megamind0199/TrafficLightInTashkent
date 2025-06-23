"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        login(result.token, () => navigate("/"));
      } else {
        alert(result.message || t("auth.loginError"));
      }
    } catch {
      alert(t("auth.networkError"));
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
        alert(result.message || t("auth.registerError"));
      }
    } catch (err) {
      alert(t("auth.networkError"));
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
          <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
          <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form
            onSubmit={handleLoginSubmit(onLogin)}
            className="space-y-4 mt-6"
          >
            <Input
              placeholder={t("auth.email")}
              {...registerLogin("email", { required: t("auth.emailRequired") })}
            />
            {loginErrors.email?.message && (
              <p className="text-sm text-red-500">
                {loginErrors.email.message}
              </p>
            )}

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.password")}
                {...registerLogin("password", {
                  required: t("auth.passwordRequired"),
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
              {loading ? t("auth.loggingIn") : t("auth.login")}
            </Button>

            <p className="text-center text-sm mt-2">
              {t("auth.noAccount")}{" "}
              <button
                type="button"
                onClick={() => setTab("register")}
                className="text-blue-600 hover:underline"
              >
                {t("auth.registerHere")}
              </button>
            </p>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form
            onSubmit={handleRegisterSubmit(onRegister)}
            className="space-y-4 mt-6"
          >
            <Input
              placeholder={t("auth.name")}
              {...registerRegister("name", {
                required: t("auth.nameRequired"),
              })}
            />
            {registerErrors.name?.message && (
              <p className="text-sm text-red-500">
                {registerErrors.name.message}
              </p>
            )}

            <Input
              placeholder={t("auth.email")}
              {...registerRegister("email", {
                required: t("auth.emailRequired"),
              })}
            />
            {registerErrors.email?.message && (
              <p className="text-sm text-red-500">
                {registerErrors.email.message}
              </p>
            )}

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.password")}
                {...registerRegister("password", {
                  required: t("auth.passwordRequired"),
                  minLength: {
                    value: 6,
                    message: t("auth.passwordMin"),
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
              {loading ? t("auth.registering") : t("auth.register")}
            </Button>

            <p className="text-center text-sm mt-2">
              {t("auth.haveAccount")}{" "}
              <button
                type="button"
                onClick={() => setTab("login")}
                className="text-blue-600 hover:underline"
              >
                {t("auth.loginHere")}
              </button>
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { ApiError } from "@popcornpicks/api-client";
import { useAuth } from "@/features/authentication/context/AuthContext";

type FormMode = "signin" | "signup" | "forgotpassword";

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<FormMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "forgotpassword") {
      setError("Password reset is not available yet.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signin") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Reset password";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 block text-center">
          <span className="text-2xl font-bold tracking-tight text-netflix-red">PopcornPicks</span>
        </Link>

        <Card className="border border-white/10 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
              {mode !== "signin" && (
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  aria-label="Back to sign in"
                  className="rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-11 pl-10 bg-background border-border"
                  required
                />
              </div>

              {mode !== "forgotpassword" && (
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    className="h-11 pl-10 bg-background border-border"
                    required
                  />
                </div>
              )}

              {mode === "signup" && (
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="h-11 pl-10 bg-background border-border"
                    required
                  />
                </div>
              )}

              {error && (
                <p role="alert" className="text-sm text-netflix-red">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary-red"
                className="w-full"
                disabled={submitting}
              >
                {submitting
                  ? "Please wait…"
                  : mode === "signin"
                    ? "Sign in"
                    : mode === "signup"
                      ? "Create account"
                      : "Send reset link"}
              </Button>

              {mode === "signin" && (
                <Button type="button" variant="glass" className="w-full gap-2">
                  <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
                    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C40 35.2 44 30 44 24c0-1.3-.1-2.6-.4-3.9z" />
                  </svg>
                  Continue with Google
                </Button>
              )}

              <div className="pt-2 text-center text-sm text-muted-foreground">
                {mode === "signin" && (
                  <>
                    <span>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-primary hover:underline"
                      >
                        Sign up
                      </button>
                    </span>
                    <br />
                    <button
                      type="button"
                      onClick={() => setMode("forgotpassword")}
                      className="mt-2 text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </>
                )}
                {mode === "signup" && (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </span>
                )}
                {mode === "forgotpassword" && (
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-primary hover:underline"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

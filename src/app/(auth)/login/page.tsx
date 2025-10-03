"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";



export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const dispatch = useAppDispatch();

  const validate = () => {
    if (!email) return "Email Required.";
    // basic email regex
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) return "Email is not correct.";
    if (!password) return "Password Required.";
    if (password.length < 8) return "Password must have minimum 8 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      // Example: POST to /api/admin/login (create this endpoint on server)
      const res = await axios.post("/api/auth/login", { email, password, remember }, { withCredentials: true });

      if (res.data.success) {
        // save token in localStorage (or cookies)
        localStorage.setItem("user", JSON.stringify(res.data.user));
        dispatch(setUser(res.data.user));
        console.log("User:", res.data.user);
        router.push('/dashboard')
      }

      // successful login
      
      // optionally redirect: use next/navigation's useRouter in parent or handle here
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Pariksha Bhawan — Admin Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                aria-label="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pariksha.example"
                autoComplete="email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  aria-label="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                <span className="text-sm">Remember me</span>
              </label>

              <button type="button" className="text-sm underline cursor-pointer" onClick={() => router.push("/forgot-password") }>Forgot?</button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 mr-2 inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : null}
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-center w-full">© Pariksha Bhawan — Administrator</p>
        </CardFooter>
      </Card>
    </div>
  );
}

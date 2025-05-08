// app/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Zod schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const { email, password } = data;

      // Admin login
      if (email === "admin@admin.com" && password === "admin123") {
        localStorage.setItem("user", JSON.stringify({ role: "admin", email }));
        router.push("/dashboard");
        return;
      }

      // Normal user login
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = await res.json();

      const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setError("User not found. Please check your email.");
      } else if (password !== user.username) {
        setError("Invalid password. Your password is your username.");
      } else {
        localStorage.setItem("user", JSON.stringify({ role: "user", email, id: user.id }));
        router.push("/dashboard");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-blue-200">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-700 font-mono">
          Welcome Back
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

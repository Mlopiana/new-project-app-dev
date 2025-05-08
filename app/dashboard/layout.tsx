"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");

      if (!storedUser?.email) {
        router.replace("/");
      } else {
        setIsAdmin(storedUser.email === "admin@admin.com");
      }
    }
  }, [mounted]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/");
  };

  const handleRestrictedRoute = (path: string) => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (storedUser?.email !== "admin@admin.com") {
      alert("Access restricted to admin only!");
      router.replace("/");
    } else {
      router.push(path);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 via-white to-blue-100">
        <p className="text-green-700 font-mono text-2xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white shadow-md rounded-b-2xl mx-4 my-2 border border-green-200">
        <div className="flex items-center space-x-6">
          <button onClick={() => router.push('/dashboard/posts')} className="text-green-700 font-bold text-xl hover:underline font-mono">
            Home
          </button>
          <button onClick={() => router.push('/dashboard/posts')} className="text-green-700 font-semibold hover:underline">
            Posts
          </button>
          <button onClick={() => handleRestrictedRoute('/dashboard/users')} className="text-green-700 font-semibold hover:underline">
            Users
          </button>
          <button onClick={() => handleRestrictedRoute('/dashboard/charts')} className="text-green-700 font-semibold hover:underline">
            Charts
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition font-semibold"
        >
          Logout
        </button>
      </nav>

      {/* Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}

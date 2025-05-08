// app/register/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Zod validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters").nonempty("First Name is required"),
  lastName: z.string().min(2, "Last Name must be at least 2 characters").nonempty("Last Name is required"),
  email: z.string().email("Please enter a valid email").nonempty("Email is required"),
  phone: z.string().min(7, "Phone number must be valid").nonempty("Phone number is required"),
  address: z.string().min(5, "Address must be at least 5 characters").nonempty("Address is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [mapAddress, setMapAddress] = useState<string>("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Registration data:", data);
    // Simulate registration (you can later connect it to localStorage or API)
    router.push("/");
  };

  // Watch address field in real-time
  const watchedAddress = watch("address");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 border border-green-200">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-green-700 font-mono">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">First Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none"
              {...register("firstName")}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Last Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none"
              {...register("lastName")}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Phone Number</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none"
              {...register("phone")}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Address</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none"
              {...register("address")}
              onChange={(e) => setMapAddress(e.target.value)}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 mt-4 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-300"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/" className="text-green-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Google Map Preview */}
        {mapAddress && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2 text-gray-700 text-center">Map Preview</h2>
            <div className="w-full h-64 overflow-hidden rounded-xl border-2 border-green-300">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

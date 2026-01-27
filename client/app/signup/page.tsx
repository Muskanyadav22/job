"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const { setToken, setUserProfile, setIsAuthenticated } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill all fields");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/v1/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profession: formData.profession || "Not specified",
        role: "jobseeker",
      });

      if (res.data.success) {
        // Save token and user to localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Update global context
        setToken(res.data.token);
        setUserProfile(res.data.user);
        setIsAuthenticated(true);

        // Set axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

        toast.success("Account created successfully!");
        router.push("/");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      console.log("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to get started</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="profession">Profession (Optional)</Label>
            <Input
              id="profession"
              name="profession"
              type="text"
              placeholder="e.g., Software Engineer"
              value={formData.profession}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}

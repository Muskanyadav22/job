import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/context/globalContext";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function SignupPage() {
  const navigate = useNavigate();
  const { setToken, setUserProfile, setIsAuthenticated } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
    role: "jobseeker",
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
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill all fields");
        return;
      }

      const res = await axios.post(`${API_URL}/api/v1/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profession: formData.profession || "Not specified",
        role: formData.role,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setToken(res.data.token);
        setUserProfile(res.data.user);
        setIsAuthenticated(true);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        toast.success("Account created successfully!");
        navigate("/");
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

          <div>
            <Label htmlFor="role">Account Type</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7263f3]"
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
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

export default SignupPage;

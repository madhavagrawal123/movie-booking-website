import { useState } from "react";
import { useNavigate, Link,useLocation } from "react-router-dom";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {
    const location = useLocation();

const redirectTo = location.state?.redirectTo || "/";
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);
      
      
      const user = response.data.user; 
      login(user);
      toast.success("Login successful!");

      
      if (user?.role === "owner") {
        navigate("/owner");
      } else {
        
        const redirectTo = location.state?.redirectTo || "/";
        navigate(redirectTo);
      }

    } catch (error) {
     toast.error(
  error.response?.data?.message || "An error occurred during login."
);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-96"
      >
        <h1 className="text-white text-3xl mb-6">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full text-white mb-4 p-3 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full text-white mb-4 p-3 rounded"
        />

        <button
          className="w-full bg-red-500 p-3 rounded text-white"
        >
          Login
        </button>

        <Link
          to="/register"
          className="text-red-400 block mt-4"
        >
          Register
        </Link>
      </form>
    </div>
  );
}

export default Login;
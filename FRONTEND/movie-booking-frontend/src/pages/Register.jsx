import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
     role: "user",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);

      login(response.data.user);

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed"
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
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full text-white mb-4 p-3 rounded"
        />

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
         <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full bg-zinc-800 text-white mb-4 p-3 rounded"
        >
          <option value="user">User</option>
          <option value="owner">Theatre Owner</option>
        </select>

        <button
          className="w-full bg-red-500 p-3 rounded text-white"
        >
          Register
        </button>

        <Link
          to="/login"
          className="text-red-400 block mt-4"
        >
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}

export default Register;
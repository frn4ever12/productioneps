import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../Hooks/UseAuth";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
    phone: "",
    is_student: true,
    is_teacher: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    api: null,
    first_name: null,
    last_name: null,
    username: null,
    email: null,
    password: null,
    password2: null,
    phone: null,
    is_student: null,
    is_teacher: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSuccess = () => {
    setError({});
    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      password2: "",
      phone: "",
      is_student: true,
      is_teacher: false,
    });
    toast.success("Registered Successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(
        formData.username,
        formData.email,
        formData.first_name,
        formData.last_name,
        formData.password,
        formData.password2,
        formData.phone,
        formData.is_student,
        formData.is_teacher
      );
      handleSuccess();
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors;
        setError(backendErrors);
        // Display error messages
        Object.values(backendErrors)
          .flat()
          .forEach((errMsg) => toast.error(errMsg));
      } else {
        // Other errors
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            {error.email && (
              <p className="text-red-500 text-xs">{error.email}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="username" className="text-gray-700">
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            {error.username && (
              <p className="text-red-500 text-xs">{error.username}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="first_name" className="text-gray-700">
              First Name
            </label>
            <input
              name="first_name"
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            {error.first_name && (
              <p className="text-red-500 text-xs">{error.first_name}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="last_name" className="text-gray-700">
              Last Name
            </label>
            <input
              name="last_name"
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            {error.last_name && (
              <p className="text-red-500 text-xs">{error.last_name}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="phone" className="text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            {error.phone && (
              <p className="text-red-500 text-xs">{error.phone}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            {error.password && (
              <p className="text-red-500 text-xs">{error.password}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="password2" className="text-gray-700">
              Confirm Password
            </label>
            <input
              name="password2"
              type="password"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            {error.password2 && (
              <p className="text-red-500 text-xs">{error.password2}</p>
            )}
          </div>
          <div className="flex items-center justify-center mt-3">
            <button
              className="w-36 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <span className="text-gray-600">Already have an account?</span>
          <NavLink to="/login" className="text-blue-600 hover:underline ml-2">
            Login
          </NavLink>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;

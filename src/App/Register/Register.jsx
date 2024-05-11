import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useAuth } from "../../Hooks/UseAuth";

const Register = () => {
  //   const { register } = useAuth();
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
    is_student: true, // Assuming all users registering are students by default
    is_teacher: false, // Assuming all users registering are not teachers by default
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

  //   const handlemail = (e) => {
  //     setError({ ...error, email: null });
  //     setformData((prev) => ({ ...prev, email: e.target.value }));
  //   };

  //   const handleUsername = (e) => {
  //     setError({ ...error, username: null });
  //     setformData((prev) => ({ ...prev, username: e.target.value }));
  //   };

  //   const handlefirstName = (e) => {
  //     setError({ ...error, first_name: null });
  //     setformData((prev) => ({ ...prev, first_name: e.target.value }));
  //   };

  //   const handlelastName = (e) => {
  //     setError({ ...error, last_name: null });
  //     setformData((prev) => ({ ...prev, last_name: e.target.value }));
  //   };

  //   const handlePassword2 = (e) => {
  //     setError({ ...error, password2: null });
  //     setformData((prev) => ({ ...prev, password2: e.target.value }));
  //   };
  //   const handlePassword = (e) => {
  //     setError({ ...error, password: null });
  //     setformData((prev) => ({ ...prev, password: e.target.value }));
  //   };
  //   const handlePhone = (e) => {
  //     setError({ ...error, phone: null });
  //     setformData((prev) => ({ ...prev, phone: e.target.value }));
  //     setformData((prev) => ({ ...prev, is_teacher: false }));
  //     setformData((prev) => ({ ...prev, is_student: true }));
  //   };

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
      toast.error(error.message);
      setError(error.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = () => {
    const errors = {};

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required.";
      // } else if (!/\S+@\S+\.\S+/.test(!formData.email)) {
      //   errors.email = "Email is invalid.";
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password should be at least 6 characters long.";
    }

    // Validate confirm password
    if (!formData.password2) {
      errors.password2 = "Confirm password is required.";
    } else if (formData.password2 !== formData.password) {
      errors.password2 = "Passwords do not match.";
    }

    // Validate first name
    if (!formData.first_name) {
      errors.first_name = "first name is required.";
    } else if (formData.first_name.length < 2) {
      errors.first_name = "first name must be greater than 2.";
    }

    // Validate last name
    if (!formData.last_name) {
      errors.last_name = "last name is required.";
    } else if (formData.first_name.length < 4) {
      errors.password2 = "last name must be greater than 4";
    }

    // Validate username
    if (!formData.username) {
      errors.username = "username is required.";
    }

    if (!formData.phone) {
      errors.phone = "phone is required.";
    }

    setError(errors);

    // Return true if there are no errors, otherwise return false
    return Object.keys(errors).length === 0;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex bg-gray-200 h-screen flex-col justify-center items-center p-4 space-y-4"
      >
        <div>
          <h2 className="font-semibold text-blue-500 text-3xl">SignUp</h2>
        </div>
        <div className="space-y-4 flex justify-center items-center flex-col">
          <div className="space-y-1 flex flex-col text-left">
            <label htmlFor="Name">user Name:</label>
            <input
              name="username"
              type="name"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="p-1 md:w-72 rounded border border-1 border-gray-500"
            />
            {error?.username && (
              <p className="text-red-300 text-sm">{error?.username}</p>
            )}
          </div>
          <div className="space-y-1 flex flex-col text-left">
            <label htmlFor="Name">First Name</label>
            <input
              name="first_name"
              type="name"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={handleChange}
              className="p-1 md:w-72 rounded border border-1 border-gray-500"
            />
            {error?.first_name && (
              <p className="text-red-300 text-sm">{error?.first_name}</p>
            )}
          </div>
          <div className="space-y-1 flex flex-col text-left">
            <label htmlFor="Name">Last Name:</label>
            <input
              name="last_name"
              type="name"
              placeholder="Enter yourLast name"
              value={formData.last_name}
              onChange={handleChange}
              className="p-1 md:w-72 rounded border border-1 border-gray-500"
            />
            {error?.last_name && (
              <p className="text-red-300 text-sm">{error?.last_name}</p>
            )}
          </div>
          <div className="space-y-1 flex flex-col text-left">
            <label htmlFor="Name">Contact</label>
            <input
              name="phone"
              type="number"
              minLength={10}
              maxLength={10}
              placeholder="9845XXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className="p-1 md:w-72 rounded border border-1 border-gray-500"
            />
            {error?.phone && (
              <p className="text-red-300 text-sm">{error?.phone}</p>
            )}
          </div>

          <div className="space-y-1 flex flex-col text-left">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-1 md:w-72 rounded border border-1 border-gray-500"
            />
            {error?.email && (
              <p className="text-red-300 text-sm">{error?.email}</p>
            )}
          </div>

          <div className="space-y-1 flex flex-col text-left">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              placeholder="**********"
              value={formData.password}
              onChange={handleChange}
              className="p-1 md:w-72 rounded border border-1 border-gray-500"
            />
            {error?.password && (
              <p className="text-red-300 text-sm">{error?.password}</p>
            )}
          </div>

          <div className="space-y-1 flex flex-col text-left">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              name="password2"
              type="password"
              placeholder="**********"
              value={formData.password2}
              onChange={handleChange}
              className="p-1 md:w-72 rounded border border-1 border-gray-500"
            />
            {error?.password2 && (
              <p className="text-red-300 text-sm">{error?.password2}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-center">
              <button
                className="p-2 px-4 bg-blue-500 hover:bg-emerald-700 rounded text-gray-100"
                disabled={loading}
              >
                {loading ? "Loading" : "Signup"}
              </button>
            </div>
            <div className="mt-4">
              <span>I already have an account.</span>
              <NavLink to="/login">
                <span className="text-blue-600 cursor-pointer mx-2">Login</span>
              </NavLink>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;

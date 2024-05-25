import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Hooks/UseAuth";
import { useGET } from "../Hooks/useApi";

const AdminProfile = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    contact: "",
    role: "Admin", // Define the role here
  });
  const [errors, setErrors] = useState({});

  const handleFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      let imagePath = URL.createObjectURL(files[0]);
      setImage(imagePath);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleForSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  const { data, loading, error } = useGET(`login/user/profile/`);
  console.log(data);

  useEffect(() => {
    if (data) {
      setValues({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        username: data.username || "",
        contact: data.phone || "",
        role: "Admin",
      });
      setImage(
        data.photo ? "https://aasu.pythonanywhere.com/" + data.photo : ""
      );
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data) return <p>No data available</p>; // Additional safety check

  return (
    <div>
      <div className="w-full flex items-center justify-center p-3">
        <form
          className="bg-white shadow-lg rounded px-8 pt-3 pb-8 mb-4 md:w-1/3 lg:w-3/4"
          onSubmit={handleForSubmit}
        >
          <div className="mb-2 text-gray-800 font-semibold text-center mx-auto">
            <h3 className="py-2 block text-gray-700 font-bold mb-2 text-xl">
              {data.first_name}'s Profile
            </h3>
            <div className="flex justify-center w-full">
              <div className="flex flex-col relative rounded-full overflow-clip w-36 h-36 bg-gray-500">
                <a href={image}>
                  {image && (
                    <img
                      src={image}
                      alt="UserImage"
                      className="w-36 h-36 rounded-full z-0 object-cover"
                    />
                  )}
                </a>
                <span
                  onClick={handleUploadClick}
                  className="cursor-pointer absolute bottom-0 h-1/3 transition-all duration-200 ease-in-out text-center p-2 w-full bg-orange-300 opacity-0 hover:opacity-90"
                >
                  <input
                    className="hidden w-0"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  Upload
                </span>
              </div>
            </div>
          </div>
          <div className="mb-8 mt-8">
            <hr></hr>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="mb-4 text-left">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={values.firstName}
                readOnly={!isEdit}
                onChange={handleChange}
              />
              {errors.firstName && (
                <p className="mt-1 text-red-700 pl-2">{errors.firstName}</p>
              )}
            </div>

            <div className="mb-6 text-left">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={values.lastName}
                readOnly={!isEdit}
                onChange={handleChange}
              />
              {errors.lastName && (
                <p className="mt-1 text-red-700 pl-2">{errors.lastName}</p>
              )}
            </div>

            <div className="mb-4 text-left">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                readOnly
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                name="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-red-700 pl-2">{errors.email}</p>
              )}
            </div>

            <div className="mb-4 text-left">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                name="username"
                value={values.username}
                readOnly={!isEdit}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-red-700 pl-2">{errors.username}</p>
              )}
            </div>

            <div className="mb-4 text-left">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="contact"
              >
                Contact
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="contact"
                type="text"
                name="contact"
                placeholder="+977"
                value={values.contact}
                onChange={handleChange}
                readOnly={!isEdit}
              />
              {errors.contact && (
                <p className="mt-1 text-red-700 pl-2">{errors.contact}</p>
              )}
            </div>

            <div className="mb-4 text-left">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="role"
              >
                Role
              </label>
              <input
                readOnly
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="role"
                type="text"
                name="role"
                placeholder="Role"
                value={values.role}
                onChange={handleChange}
              />
              {errors.role && (
                <p className="mt-1 text-red-700 pl-2">{errors.role}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-between">
            <button
              className="w-medium bg-blue hover:bg-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
            <div
              className="mt-3 px-2 py-1 border-2 rounded cursor-pointer inline-block align-baseline font-bold text-sm text-blue hover:text-blue"
              onClick={() => setIsEdit(!isEdit)}
            >
              {isEdit ? (
                <span className="w-full h-full text-red-400">
                  Cancel Editing
                </span>
              ) : (
                <span className="w-full h-full text-green-700">
                  Edit Profile
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;

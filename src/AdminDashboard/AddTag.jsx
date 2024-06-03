import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../Hooks/UseAuth";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const AddTag = () => {
  const { user } = useAuth();
  const [tagName, setTagName] = useState("");
  const [response, setResponse] = useState(null);

  const handleInputChange = (e) => {
    setTagName(e.target.value);
  };

  const sendTagName = async () => {
    const url = "https://aasu.pythonanywhere.com/tags/create/";

    try {
      const res = await axios.post(
        url,
        { tage_name: tagName },
        {
          headers: {
            Authorization: `Bearer ${user.token.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(res.data);
      toast.success("Tag added successfully!");
      setTagName(""); // Clear input after successful submission
    } catch (error) {
      console.error("Error sending tag name:", error);
      setResponse(error.response ? error.response.data : "Error");
      toast.error("Failed to add tag.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6 mt-6">
        <div className="text-gray-700 sans-serif-text text-3xl ml-48">
          Add Tag
        </div>
        <div className="mr-48">
          <Link to="/taglist">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Tags List
            </button>
          </Link>
        </div>
      </div>
      <div className="mx-44 mt-10 p-6 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendTagName();
          }}
        >
          <div className="mb-4">
            <label className="block mb-2">Tag Name:</label>
            <input
              type="text"
              value={tagName}
              onChange={handleInputChange}
              placeholder="Enter tag name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-34 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Tag Name
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddTag;

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../Hooks/UseAuth";
import { ToastContainer, toast } from "react-toastify";

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
    } catch (error) {
      console.error("Error sending tag name:", error);
      setResponse(error.response ? error.response.data : "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <input
        type="text"
        value={tagName}
        onChange={handleInputChange}
        placeholder="Enter tag name"
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={sendTagName}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send Tag Name
      </button>
      <ToastContainer />
    </div>
  );
};

export default AddTag;

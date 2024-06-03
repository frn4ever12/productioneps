import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Hooks/UseAuth";
import { useGET } from "../Hooks/useApi";
import axios from "axios";
import { toast } from "react-toastify";

function UpdateQuiz() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGET(`quize/${id}/`);

  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [price, setPrice] = useState("");
  const [timeDuration, setTimeDuration] = useState("");
  const [photo, setPhoto] = useState(null);
  const [active, setActive] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (data) {
      setHeading(data.heading);
      setSubHeading(data.sub_heading !== "null" ? data.sub_heading : "");
      setPrice(data.price);
      setTimeDuration(data.time_duration);
      setActive(data.active);
      setSelectedTags(data.tags.map((tag) => tag.id));
    }
  }, [data]);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleHeadingChange = (e) => {
    setHeading(e.target.value);
  };

  const handleSubHeadingChange = (e) => {
    setSubHeading(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTimeDuration(e.target.value);
  };

  const handleActiveChange = (e) => {
    setActive(e.target.value === "true");
  };

  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedTags(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (photo) {
      formData.append("photo", photo);
    }

    formData.append("heading", heading);
    formData.append("sub_heading", subHeading);
    formData.append("price", price);
    formData.append("time_duration", timeDuration);
    formData.append("active", active);
    formData.append("tags", selectedTags.join(","));

    try {
      await axios.put(
        `https://aasu.pythonanywhere.com/quize/update/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Quiz updated successfully.");
      navigate("/listquize", { replace: true });
    } catch (error) {
      toast.error("Failed to update quiz. Please try again.");
      console.error("Error updating quiz:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6 mt-6">
        <div className="text-gray-700 sans-serif-text text-3xl ml-0">
          Quiz Update
        </div>
        <div>
          <Link to="/addquiz">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Add Quiz
            </button>
          </Link>
          <Link to="/listquize" className="ml-4">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Quiz List
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Photo:</label>
            <input type="file" name="photo" onChange={handlePhotoChange} />
            {data.photo && (
              <img
                src={`https://aasu.pythonanywhere.com${data.photo}`} // Displaying image from API
                alt="Preview"
                className="mt-4 rounded-lg"
                style={{ maxWidth: "300px" }}
              />
            )}
          </div>
          <div>
            <label className="block mb-2">Heading:</label>
            <input
              type="text"
              name="heading"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Sub Heading:</label>
            <input
              type="text"
              name="sub_heading"
              value={subHeading}
              onChange={handleSubHeadingChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Price:</label>
            <input
              type="text"
              name="price"
              value={price}
              onChange={handlePriceChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Active:</label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="active"
                  value="true"
                  checked={active === true}
                  onChange={handleActiveChange}
                  className="mr-2"
                />
                <span className="border border-gray-300 w-20 rounded-lg px-4 py-2">
                  Yes
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="active"
                  value="false"
                  checked={active === false}
                  onChange={handleActiveChange}
                  className="mr-2"
                />
                <span className="border border-gray-300 w-20 rounded-lg px-4 py-2">
                  No
                </span>
              </label>
            </div>
          </div>
          <div>
            <label className="block mb-2">Tags:</label>
            <select
              name="tags"
              multiple
              value={selectedTags}
              onChange={handleTagChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              {data.tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.tage_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Time Duration:</label>
            <input
              type="text"
              name="time_duration"
              value={timeDuration}
              onChange={handleTimeChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
        <div className="mt-8">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            type="submit"
          >
            Update Quiz
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateQuiz;

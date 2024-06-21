import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../Hooks/UseAuth";
import { Link } from "react-router-dom";

const AddQuiz = (headers = {}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    price: "",
    tags: [],
    timeDuration: "",
    active: true,
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tagHeadings, setTagHeadings] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [IsLoading, setIsLoading] = useState();

  const optionsListRef = useRef(null);

  useEffect(() => {
    const fetchTagHeadings = async () => {
      try {
        const response = await axios.get(
          "https://aasu.pythonanywhere.com/tags/"
        );
        setTagHeadings(response.data);
      } catch (error) {
        console.error("Failed to fetch tag headings:", error);
      }
    };

    fetchTagHeadings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagChange = (selectedTags) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: selectedTags,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleRadioChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      active: e.target.value === "true",
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const formDataWithFile = new FormData();
    formDataWithFile.append("photo", file);
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "tags") {
        formDataWithFile.append(key, value);
      }
    });
    formDataWithFile.append("tags", JSON.stringify(formData.tags));

    try {
      const response = await axios.post(
        "https://aasu.pythonanywhere.com/quize/create/",
        formDataWithFile,
        {
          headers: {
            ...headers,
            Authorization: `Bearer ${user.token.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Quiz added successfully:", response.data);
      alert("Quiz added successfully");

      setFormData({
        heading: "",
        subHeading: "",
        price: "",
        tags: [],
        timeDuration: "",
        active: true,
      });
      setFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to add quiz:", error.response.data);
      alert("Failed to add quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAllClick = (e) => {
    e.preventDefault();
    const allOptions = tagHeadings.map((tag) => tag.id);
    handleTagChange(allOptions);
  };

  const handleClearSelectionClick = (e) => {
    e.preventDefault();
    handleTagChange([]);
  };

  const handleOptionChange = (optionId) => {
    setFormData((prevData) => {
      const newSelectedOptions = prevData.tags.includes(optionId)
        ? prevData.tags.filter((id) => id !== optionId)
        : [...prevData.tags, optionId];
      console.log("Selected tags:", newSelectedOptions);
      return { ...prevData, tags: newSelectedOptions };
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6 mt-6">
        <div className="text-gray-700 sans-serif-text text-3xl ml-0">
          Quiz List
        </div>
        <div>
          <Link to="/listquize">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Quiz ListT
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Photo:</label>
            <input type="file" name="photo" onChange={handleFileChange} />
            {imagePreview && (
              <img
                src={imagePreview}
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
              value={formData.heading}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Sub Heading:</label>
            <input
              type="text"
              name="sub_heading"
              value={formData.sub_heading}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Price:</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Tags:</label>
            <div className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left"
              >
                Select Tags
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="flex justify-between p-2">
                    <button
                      onClick={handleSelectAllClick}
                      disabled={formData.tags.length === tagHeadings.length}
                      className="p-2 text-blue-500"
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleClearSelectionClick}
                      disabled={formData.tags.length === 0}
                      className="p-2 text-blue-500"
                    >
                      Clear Selection
                    </button>
                  </div>
                  <ul
                    ref={optionsListRef}
                    className="p-2 max-h-60 overflow-auto"
                  >
                    {tagHeadings.map((tagHeading) => (
                      <li key={tagHeading.id} className="flex items-center">
                        <input
                          type="checkbox"
                          value={tagHeading.id}
                          checked={formData.tags.includes(tagHeading.id)}
                          onChange={() => handleOptionChange(tagHeading.id)}
                          className="mr-2"
                        />
                        <label>{tagHeading.tage_name}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-2">Time Duration:</label>
            <input
              type="text"
              name="time_duration"
              value={formData.time_duration}
              onChange={handleChange}
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
                  checked={formData.active === true}
                  onChange={handleRadioChange}
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
                  checked={formData.active === false}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                <span className="border border-gray-300 w-20 rounded-lg px-4 py-2">
                  No
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button
            disabled={IsLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            type="submit"
          >
            {IsLoading ? "Subbmitting..." : "  Submit Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuiz;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Hooks/UseAuth";

const AddQuiz = (headers = {}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    price: "",
    // tags: "",
    tags: [],
    timeDuration: "",
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tagHeadings, setTagHeadings] = useState([]);

  useEffect(() => {
    const fetchTagHeadings = async () => {
      try {
        const response = await axios.get(
          "https://aasu.pythonanywhere.com/tags/"
        );
        setTagHeadings(response.data);
        console.log("============================", tagHeadings);
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithFile = new FormData();
    formDataWithFile.append("photo", file);
    Object.entries(formData).forEach(([key, value]) => {
      formDataWithFile.append(key, value);
    });

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
        // tags: "",
        tags: [],
        timeDuration: "",
      });
      setFile(null);
      setImagePreview(null);

      // refetch();
    } catch (error) {
      console.error("Failed to add quiz:", error.response.data);
      alert("Failed to add quiz. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add Quiz</h1>
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
            <label className="block mb-2">Tag:</label>
            <select
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select Tag</option>
              {tagHeadings.map((tagHeading) => (
                <option key={tagHeading.id} value={tagHeading.id}>
                  {tagHeading.tage_name}
                </option>
              ))}
            </select>
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
        </div>
        <div className="mt-8">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            type="submit"
          >
            Submit Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuiz;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Hooks/UseAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAnswer = () => {
  const { user } = useAuth();
  const [questionHeadings, setQuestionHeadings] = useState([]);

  const [inputType, setInputType] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    option_image1: null,
    option_image2: null,
    option_image3: null,
    option_image4: null,
    option_audio1: null,
    option_audio2: null,
    option_audio3: null,
    option_audio4: null,
    correct_answer: null,
  });

  useEffect(() => {
    const fetchQuestionHeadings = async () => {
      try {
        const response = await axios.get(
          "https://aasu.pythonanywhere.com/question/"
        );
        setQuestionHeadings(response.data);
      } catch (error) {
        console.error("Failed to fetch question headings:", error);
      }
    };

    fetchQuestionHeadings();
  }, []);

  const handleQuestionChange = (e) => {
    setFormData({ ...formData, question: e.target.value });
  };

  const handleInputChange = (e) => {
    setInputType(e.target.value);
  };

  const handleFileChange = (name, file) => {
    console.log("File received:", file);

    const updatedFormData = {
      ...formData,
      [name]: file,
    };

    console.log("Updated FormData:", updatedFormData);
    setFormData(updatedFormData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { question, ...data } = formData;
    const url = `https://aasu.pythonanywhere.com/answer/create/${question}/`;

    try {
      const formData = new FormData();
      formData.append("question", question);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (
            key.startsWith("option_image") ||
            key.startsWith("option_audio")
          ) {
            // Append image or audio files to FormData
            formData.append(key, value, value.name);
            console.log("FormData after appending file:", formData);
          } else {
            formData.append(key, value);
          }
        }
      });

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${user.token.access}`,
          // No need to set Content-Type, axios will automatically set it
        },
      });

      // Reset form data after successful submission if needed
      setFormData({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        option_image1: null,
        option_image2: null,
        option_image3: null,
        option_image4: null,
        option_audio1: null,
        option_audio2: null,
        option_audio3: null,
        option_audio4: null,
        correct_answer: "",
      });

      toast.success("Answer added successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add answer");
    }
  };

  const renderQuestionDropdown = () => (
    <select
      className="p-2 border rounded-md"
      value={formData.question}
      onChange={handleQuestionChange}
    >
      <option value="">Select Question</option>
      {questionHeadings.map((question) => (
        <option key={question.id} value={question.id}>
          {question.questions}
        </option>
      ))}
    </select>
  );

  const renderInputFields = () => {
    switch (inputType) {
      case "text":
        return Array.from({ length: 4 }).map((_, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={formData[`option${index + 1}`]}
            onChange={(e) =>
              setFormData({
                ...formData,
                [`option${index + 1}`]: e.target.value,
              })
            }
            className="p-2 border rounded-md"
          />
        ));
      case "audio":
        return Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <input
              key={index}
              type="file"
              onChange={(e) =>
                handleFileChange(`option_audio${index + 1}`, e.target.files[0])
              }
              className="p-2 border rounded-md"
            />
            {formData[`option_audio${index + 1}`] && (
              <audio controls>
                <source
                  src={URL.createObjectURL(
                    formData[`option_audio${index + 1}`]
                  )}
                  type="audio/mpeg"
                />
              </audio>
            )}
          </div>
        ));
      case "imag":
        return Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <input
              key={index}
              type="file"
              onChange={(e) =>
                handleFileChange(`option_image${index + 1}`, e.target.files[0])
              }
              className="p-2 border rounded-md"
            />
            {formData[`option_image${index + 1}`] && (
              <img
                src={URL.createObjectURL(formData[`option_image${index + 1}`])}
                alt={`Option ${index + 1}`}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            )}
          </div>
        ));
      default:
        return null;
    }
  };

  const filteredDropdownOptions = Object.entries(formData)
    .filter(
      ([key, value]) =>
        key.startsWith("option") && value !== null && value !== ""
    )
    .map(([key]) => key);

  return (
    <form
      className="flex flex-col space-y-4 p-2 border rounded-md"
      onSubmit={handleFormSubmit}
    >
      <label>Question:</label>
      {renderQuestionDropdown()}
      <div>
        <label>Select Input Type:</label>
        <select
          className="p-2 border rounded-md"
          value={inputType}
          onChange={handleInputChange}
        >
          <option value="">Select Input Type</option>
          <option value="text">Text</option>
          <option value="audio">Audio</option>
          <option value="imag">Image</option>
        </select>
      </div>
      {renderInputFields()}
      <div>
        <label>Select Correct Option:</label>
        <select
          className="p-2 border rounded-md"
          value={formData.correct_answer}
          onChange={(e) =>
            setFormData({ ...formData, correct_answer: e.target.value })
          }
        >
          <option value="">Select Correct Option</option>
          {filteredDropdownOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
        Submit
      </button>
    </form>
  );
};

export default AddAnswer;

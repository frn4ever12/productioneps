import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGET } from "../Hooks/useApi";

const UpdateQuestionAnswer = () => {
  //   const { id } = useParams();
  //     const {data , isLoading}=useGET("/")
  const [inputType, setInputType] = useState("");
  const [answers, setAnswers] = useState({
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
  const [question, setQuestion] = useState({
    questions: "",
    question_table: "",
    question_img: null,
    question_audio: null,
  });

  const handleInputTypeChange = (event) => {
    setInputType(event.target.value);
  };

  const handleFileChange = (name, file) => {
    const updatedAnswers = {
      ...answers,
      [name]: file,
    };
    setAnswers(updatedAnswers);
  };

  const handleQuestionChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setQuestion({
        ...question,
        [name]: files[0],
      });
    } else {
      setQuestion({
        ...question,
        [name]: value,
      });
    }
  };

  const renderInputFields = () => {
    switch (inputType) {
      case "text":
        return Array.from({ length: 4 }).map((_, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={answers[`option${index + 1}`]}
            onChange={(e) =>
              setAnswers({
                ...answers,
                [`option${index + 1}`]: e.target.value,
              })
            }
            className="p-2 border rounded-md w-full mb-2"
          />
        ));
      case "audio":
        return Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="file"
              onChange={(e) =>
                handleFileChange(`option_audio${index + 1}`, e.target.files[0])
              }
              className="p-2 border rounded-md w-full"
            />
            {answers[`option_audio${index + 1}`] && (
              <audio controls className="ml-2">
                <source
                  src={URL.createObjectURL(answers[`option_audio${index + 1}`])}
                  type="audio/mpeg"
                />
              </audio>
            )}
          </div>
        ));
      case "image":
        return Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="file"
              accept="image/*"
              name={`option_image${index + 1}`}
              onChange={(e) =>
                handleFileChange(`option_image${index + 1}`, e.target.files[0])
              }
              className="p-2 border rounded-md w-full"
            />
            {answers[`option_image${index + 1}`] && (
              <img
                src={URL.createObjectURL(answers[`option_image${index + 1}`])}
                alt={`Option ${index + 1}`}
                className="ml-2 max-w-24 max-h-24"
              />
            )}
          </div>
        ));
      default:
        return null;
    }
  };

  const filteredDropdownOptions = Object.entries(answers)
    .filter(
      ([key, value]) =>
        key.startsWith("option") && value !== null && value !== ""
    )
    .map(([key]) => key);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!question.questions || !answers.correct_answer) {
      toast.error("Please fill all required fields.");
      return;
    }

    toast.success("Form submitted successfully!");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Update Question and Answer</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Question</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions:</label>
                <input
                  type="text"
                  name="questions"
                  value={question.questions}
                  onChange={handleQuestionChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Table:</label>
                <input
                  type="text"
                  name="question_table"
                  value={question.question_table}
                  onChange={handleQuestionChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  name="question_img"
                  onChange={handleQuestionChange}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Sound:</label>
                <input
                  type="file"
                  accept="audio/*"
                  name="question_audio"
                  onChange={handleQuestionChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Add Answer</h2>
            <div className="space-y-4">
              <div>
                <label>Select Input Type:</label>
                <select
                  className="p-2 border rounded-md w-full"
                  value={inputType}
                  onChange={handleInputTypeChange}
                >
                  <option value="">Select Input Type</option>
                  <option value="text">Text</option>
                  <option value="audio">Audio</option>
                  <option value="image">Image</option>
                </select>
              </div>
              {renderInputFields()}
              <div>
                <label>Select Correct Option:</label>
                <select
                  className="p-2 border rounded-md w-full"
                  value={answers.correct_answer}
                  onChange={(e) =>
                    setAnswers({ ...answers, correct_answer: e.target.value })
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
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateQuestionAnswer;

import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useGET } from "../Hooks/useApi";
import { useAuth } from "../Hooks/UseAuth";

const UpdateQuestionAnswer = () => {
  const { user } = useAuth();
  const { id } = useParams();

  const { data, isLoading } = useGET(`question/indivisual/list/${id}/`);
  console.log(data);
  const [inputType, setInputType] = useState("");
  const [formData, setFormData] = useState({
    questions: "",
    question_table: null,
    question_img: null,
    question_audio: null,
    quize: id,
    option1: null,
    option2: null,
    option3: null,
    option4: null,
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

  useEffect(() => {
    // Set formData based on fetched data
    if (data && data.length > 0) {
      const questionData = data[0];
      setFormData((prevData) => ({
        ...prevData,
        questions: questionData.questions || "",
        question_table: questionData.question_table || null,
        question_img: questionData.question_img || null,
        question_audio: questionData.question_audio || null,
      }));
      if (questionData.answer && questionData.answer.length > 0) {
        const answerData = questionData.answer[0];
        setFormData((prevData) => ({
          ...prevData,
          option1: answerData.option1 || null,
          option2: answerData.option2 || null,
          option3: answerData.option3 || null,
          option4: answerData.option4 || null,
          option_image1: answerData.option_image1 || null,
          option_image2: answerData.option_image2 || null,
          option_image3: answerData.option_image3 || null,
          option_image4: answerData.option_image4 || null,
          option_audio1: answerData.option_audio1 || null,
          option_audio2: answerData.option_audio2 || null,
          option_audio3: answerData.option_audio3 || null,
          option_audio4: answerData.option_audio4 || null,
          correct_answer: answerData.correct_answer || "",
        }));
      }
    }
  }, [data]);

  // const handleQuestionChange = (e) => {
  //   const { name, value, files } = e.target;
  //   setFormData(prevData => ({
  //     ...prevData,
  //     [name]: files ? files[0] : value,
  //   }));
  // };

  // const handleInputTypeChange = (event) => {
  //   setInputType(event.target.value);
  // };
  const handleQuestionChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;

    console.log(`Change in ${name}:`, newValue);

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleInputTypeChange = (event) => {
    const newValue = event.target.value;

    console.log("Input Type Changed:", newValue);

    setInputType(newValue);
  };

  const renderInputFields = () => {
    return Object.entries(formData).map(([key, value], index) => {
      if (key.startsWith("option") && value !== null && value !== "") {
        if (key.startsWith("option_image")) {
          return (
            <div key={index} className="flex items-center mb-2">
              <input
                type="file"
                accept="image/*"
                name={key}
                onChange={(e) => handleFileChange(key, e.target.files[0])}
                className="p-2 border rounded-md w-full"
              />
              {value instanceof File ? (
                <img
                  src={URL.createObjectURL(value)}
                  alt={`Option ${index + 1}`}
                  className="ml-2 max-w-24 max-h-24"
                />
              ) : (
                <img
                  src={value}
                  alt={`Option ${index + 1}`}
                  className="ml-2 max-w-24 max-h-24"
                />
              )}
            </div>
          );
        } else if (key.startsWith("option_audio")) {
          return (
            <div key={index} className="flex items-center mb-2">
              <input
                type="file"
                accept="audio/*"
                name={key}
                onChange={(e) => handleFileChange(key, e.target.files[0])}
                className="p-2 border rounded-md w-full"
              />
              {value instanceof File ? (
                <audio controls className="ml-2">
                  <source src={URL.createObjectURL(value)} type="audio/mpeg" />
                </audio>
              ) : (
                <audio controls className="ml-2">
                  <source src={value} type="audio/mpeg" />
                </audio>
              )}
            </div>
          );
        } else {
          return (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [key]: e.target.value,
                })
              }
              className="p-2 border rounded-md w-full mb-2"
            />
          );
        }
      }
      return null;
    });
  };

  const handleFileChange = (name, file) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    console.log(formDataToSend);

    try {
      const response = await axios.put(
        `https://aasu.pythonanywhere.com/question/answer/update/${id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${user.token.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Question and answers updated successfully!");
    } catch (error) {
      toast.error("Failed to update question and answers.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Update Question and Answer</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Question</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="flex items-center">
                  <label className="mr-4 w-32">Questions:</label>
                  <input
                    type="text"
                    name="questions"
                    value={formData.questions}
                    onChange={handleQuestionChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                  />
                </label>
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Table:</label>
                <input
                  type="text"
                  name="question_table"
                  value={formData.question_table}
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
                  value={formData.correct_answer}
                  onChange={(e) =>
                    setFormData({ ...formData, correct_answer: e.target.value })
                  }
                >
                  <option value="">Select Correct Option</option>
                  {Object.entries(formData)
                    .filter(
                      ([key, value]) =>
                        key.startsWith("option") &&
                        value !== null &&
                        value !== ""
                    )
                    .map(([option, _], index) => (
                      <option key={index} value={option}>
                        {option.replace("option", "Option ")}
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

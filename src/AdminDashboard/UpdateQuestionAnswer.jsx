import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useGET } from "../Hooks/useApi";
import { useAuth } from "../Hooks/UseAuth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UpdateQuestionAnswer = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGET(`question/indivisual/list/${id}/`);
  const [formData, setFormData] = useState({
    questions: "",
    sub_question: "",
    question_table: "",
    question_img: null,
    question_audio: null,
    quize: null,
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

  useEffect(() => {
    if (data && data.length > 0) {
      const questionData = data[0];
      setFormData((prevData) => ({
        ...prevData,
        quize: questionData.quize || "",
        questions: questionData.questions || "",
        sub_question: questionData.sub_question || "",
        question_table: questionData.question_table || "",
        question_img: questionData.question_img || null,
        question_audio: questionData.question_audio || null,
      }));
      if (questionData.answer && questionData.answer.length > 0) {
        const answerData = questionData.answer[0];
        setFormData((prevData) => ({
          ...prevData,
          option1: answerData.option1 || "",
          option2: answerData.option2 || "",
          option3: answerData.option3 || "",
          option4: answerData.option4 || "",
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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleQuillChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      question_table: value,
    }));
  };

  const urlToFile = async (url, filename, mimeType) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new File([buffer], filename, { type: mimeType });
  };

  const appendFormData = async (formDataToSend, key, value) => {
    if (value && typeof value === "string" && value.startsWith("/")) {
      const filename = value.split("/").pop();
      let mimeType = "application/octet-stream";
      if (key.includes("img") || key.includes("image")) {
        mimeType = "image/jpeg";
      } else if (key.includes("audio")) {
        mimeType = "audio/mpeg";
      }
      const file = await urlToFile(
        `https://aasu.pythonanywhere.com${value}`,
        filename,
        mimeType
      );
      formDataToSend.append(key, file);
    } else {
      formDataToSend.append(key, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    for (const key in formData) {
      if (
        formData.hasOwnProperty(key) &&
        formData[key] !== null &&
        formData[key] !== ""
      ) {
        await appendFormData(formDataToSend, key, formData[key]);
      }
    }

    try {
      await axios.put(
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
      navigate("/questionlist");
    } catch (error) {
      toast.error("Failed to update question and answers.");
      console.error("Error:", error.response.data);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6 mt-6">
        <div className="text-gray-700 sans-serif-text text-3xl ml-0">
          Update Question and Answer
        </div>
        <div>
          <Link to="/addquestion">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Add Question
            </button>
          </Link>
          <Link to="/questionlist" className="ml-4">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Question List
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="space-y-8">
          <div className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Question</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="flex items-center">
                  <span className="mr-4 w-32">Questions:</span>
                  <input
                    type="text"
                    name="questions"
                    value={formData.questions}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                  />
                </label>
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <span className="mr-4 w-32">sub Questions:</span>
                  <input
                    type="text"
                    name="sub_question"
                    value={formData.sub_question}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                  />
                </label>
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Table:</label>
                <ReactQuill
                  value={formData.question_table}
                  onChange={handleQuillChange}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  name="question_img"
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
              {formData.question_img && (
                <div className="flex items-center">
                  {formData.question_img instanceof File ? (
                    <img
                      src={URL.createObjectURL(formData.question_img)}
                      alt="Question"
                      className="ml-2 max-w-24 max-h-24"
                    />
                  ) : (
                    <img
                      src={`https://aasu.pythonanywhere.com${formData.question_img}`}
                      alt="Question"
                      className="ml-2 max-w-24 max-h-24"
                    />
                  )}
                </div>
              )}
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Sound:</label>
                <input
                  type="file"
                  accept="audio/*"
                  name="question_audio"
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
              {formData.question_audio && (
                <div className="flex items-center">
                  {formData.question_audio instanceof File ? (
                    <audio controls className="ml-2">
                      <source
                        src={URL.createObjectURL(formData.question_audio)}
                        type="audio/mpeg"
                      />
                    </audio>
                  ) : (
                    <audio controls className="ml-2">
                      <source
                        src={`https://aasu.pythonanywhere.com${formData.question_audio}`}
                        type="audio/mpeg"
                      />
                    </audio>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Add Answer</h2>
            <div className="space-y-4">
              {["option1", "option2", "option3", "option4"].map(
                (option, idx) => (
                  <div key={option} className="flex items-center">
                    <label className="mr-4 w-32">{`Option ${idx + 1}:`}</label>
                    <input
                      type="text"
                      name={option}
                      value={formData[option]}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                  </div>
                )
              )}
              {[
                "option_image1",
                "option_image2",
                "option_image3",
                "option_image4",
              ].map((option, idx) => (
                <div key={option} className="flex items-center mb-2">
                  <label className="mr-4 w-32">{`Image ${idx + 1}:`}</label>
                  <input
                    type="file"
                    accept="image/*"
                    name={option}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                  {formData[option] && (
                    <div className="flex items-center">
                      {formData[option] instanceof File ? (
                        <img
                          src={URL.createObjectURL(formData[option])}
                          alt={`Option Image ${idx + 1}`}
                          className="ml-2 max-w-24 max-h-24"
                        />
                      ) : (
                        <img
                          src={`https://aasu.pythonanywhere.com${formData[option]}`}
                          alt={`Option Image ${idx + 1}`}
                          className="ml-2 max-w-24 max-h-24"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
              {[
                "option_audio1",
                "option_audio2",
                "option_audio3",
                "option_audio4",
              ].map((option, idx) => (
                <div key={option} className="flex items-center mb-2">
                  <label className="mr-4 w-32">{`Audio ${idx + 1}:`}</label>
                  <input
                    type="file"
                    accept="audio/*"
                    name={option}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                  {formData[option] && (
                    <div className="flex items-center">
                      {formData[option] instanceof File ? (
                        <audio controls className="ml-2">
                          <source
                            src={URL.createObjectURL(formData[option])}
                            type="audio/mpeg"
                          />
                        </audio>
                      ) : (
                        <audio controls className="ml-2">
                          <source
                            src={`https://aasu.pythonanywhere.com${formData[option]}`}
                            type="audio/mpeg"
                          />
                        </audio>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div>
                <label>Select Correct Option:</label>
                <select
                  className="p-2 border rounded-md w-full"
                  value={formData.correct_answer}
                  onChange={handleInputChange}
                  name="correct_answer"
                >
                  <option value="">Select Correct Option</option>
                  {["option1", "option2", "option3", "option4"].map(
                    (option, idx) => (
                      <option key={option} value={option}>
                        {`Option ${idx + 1}`}
                      </option>
                    )
                  )}
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

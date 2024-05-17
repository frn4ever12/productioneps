import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Hooks/UseAuth";
import AddAnswer from "./AddAnswer";

function AddQuestion(headers = {}) {
  const { user } = useAuth();
  const [questionCount, setQuestionCount] = useState(1);
  const [questions, setQuestions] = useState([
    {
      quize: "",
      questions: "",
      question_table: "",
      question_img: null,
      imgPreview: null,
      question_audio: null,
      audioPreview: null,
    },
  ]);
  const [quizHeadings, setQuizHeadings] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [showAddAnswer, setShowAddAnswer] = useState(false);

  useEffect(() => {
    const fetchQuizeHeadings = async () => {
      try {
        const response = await axios.get(
          "https://exam.advicekoreanlearningcenter.com/quize/"
        );
        setQuizHeadings(response.data);

        console.log("============================", quizHeadings);
      } catch (error) {
        console.error("Failed to fetch tag headings:", error);
      }
    };

    fetchQuizeHeadings();
  }, []);

  // const addQuestion = () => {
  //   setShowAddAnswer(false);
  //   setQuestionCount(questionCount + 1);
  // };

  // const deleteQuestion = (index) => {
  //   const newQuestions = questions.filter((_, i) => i !== index);
  //   setQuestions(newQuestions);
  //   setQuestionCount(questionCount - 1);
  // };

  const closeAnswer = () => {
    setShowAddAnswer(false);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [name]: value };
    setQuestions(newQuestions);
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      question_img: file,
      imgPreview: URL.createObjectURL(file),
    };
    setQuestions(newQuestions);
  };

  const handleFileChange1 = (e, index) => {
    const file = e.target.files[0];
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      question_audio: file,
      audioPreview: URL.createObjectURL(file),
    };
    setQuestions(newQuestions);
  };

  const handleQuizSelect = (e) => {
    setSelectedQuizId(e.target.value); // Update selected quiz ID
  };

  const submitQuestions = async () => {
    setShowAddAnswer(true);
    try {
      await Promise.all(
        questions.map(async (question) => {
          const formData = new FormData();
          // formData.append("quize", question.quize);
          formData.append("quize", selectedQuizId);
          formData.append("questions", question.questions);
          formData.append("question_table", question.question_table);
          // Append image and audio files if provided
          if (question.question_img) {
            formData.append("question_img", question.question_img);
          }
          if (question.question_audio) {
            formData.append("question_audio", question.question_audio);
          }

          const response = await axios.post(
            "https://exam.advicekoreanlearningcenter.com/question/create/",
            formData,
            {
              headers: {
                ...headers,
                Authorization: `Bearer ${user.token.access}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Question added successfully:", response.data);
          setQuestionId(response.data.id);
          console.log(questionId);
          alert("Question added successfully:", response.data);
        })
      );
    } catch (error) {
      alert("Failed to add question:", error.response.data);
      console.error("Failed to add question:", error.response.data);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add Question</h1>
      {/* <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors duration-300"
        onClick={addQuestion}
      >
        Add Question
      </button> */}
      <div className="space-y-8">
        {[...Array(questionCount)].map((_, index) => (
          <div key={index} className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Question {index + 1}</h2>
            <div className="space-y-4">
              {/* <div className="flex items-center">
                <label className="mr-4 w-32">Quiz ID:</label>
                <input
                  type="text"
                  name="quize"
                  value={questions[index]?.quize || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                />
              </div> */}
              <div className="flex items-center">
                <label className="mr-4 w-32">Quiz:</label>
                <select
                  value={selectedQuizId}
                  onChange={handleQuizSelect}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                >
                  <option value="" disabled>
                    Select Quiz
                  </option>
                  {quizHeadings.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.heading}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="mr-4 w-32">Questions:</label>
                <input
                  type="text"
                  name="questions"
                  value={questions[index]?.questions || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Table:</label>
                <input
                  type="text"
                  name="question_table"
                  value={questions[index]?.question_table || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  name="question_img"
                  onChange={(e) => handleFileChange(e, index)}
                  className="flex-1"
                />
                {questions[index]?.imgPreview && (
                  <img
                    src={questions[index].imgPreview}
                    alt="Image Preview"
                    className="w-40 h-30 ml-4 rounded-lg"
                  />
                )}
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Sound:</label>
                <input
                  type="file"
                  accept="audio/*"
                  name="question_audio"
                  onChange={(e) => handleFileChange1(e, index)}
                  className="flex-1"
                />
                {questions[index]?.audioPreview && (
                  <audio controls className="ml-4">
                    <source
                      src={questions[index].audioPreview}
                      type="audio/mp3"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-8 hover:bg-blue-600 transition-colors duration-300"
              onClick={submitQuestions}
            >
              Add Answer
            </button>

            {showAddAnswer && (
              <AddAnswer onsubmit={closeAnswer} questionid={questionId} />
            )}
            {/* {index === questionCount - 1 && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors duration-300"
                onClick={addQuestion}
              >
                Add Question
              </button>
            )} */}
            {/* <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 mr-4 hover:bg-red-600 transition-colors duration-300"
              onClick={() => deleteQuestion(index)}
            >
              Delete
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddQuestion;

import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useGET } from "../Hooks/useApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Hooks/UseAuth";

function AddQuestion() {
  const [quizid, setQuizId] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // New state variable

  const { user } = useAuth();

  const initialQuestionState = {
    questions: "",
    sub_question: "",
    question_table: "",
    question_img: null,
    question_audio: null,
    quize: "",
  };

  const initialAnswersState = {
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
  };

  const [inputType, setInputType] = useState("");
  const [answers, setAnswers] = useState(initialAnswersState);
  const [question, setQuestion] = useState(initialQuestionState);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);

  const { data, isLoading } = useGET("quize/");

  useEffect(() => {
    const fetchQuestions = async () => {
      if (quizid) {
        try {
          const response = await fetch(
            `https://aasu.pythonanywhere.com/question/list/${quizid}/`
          );
          if (response.ok) {
            const data = await response.json();
            setNumberOfQuestions(data.length);
          } else {
            setNumberOfQuestions(0);
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
          setNumberOfQuestions(0);
        }
      } else {
        setNumberOfQuestions(0);
      }
    };

    fetchQuestions();
  }, [quizid, formSubmitted]); // Include formSubmitted as a dependency

  const handleDropdownChange = (event) => {
    setQuizId(event.target.value);
  };

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

  const handleQuillChange = (value) => {
    setQuestion({
      ...question,
      question_table: value,
    });
  };

  const renderInputFields = () => {
    switch (inputType) {
      case "text":
        return Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-full"
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              // key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={answers[`option${index + 1}`]}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [`option${index + 1}`]: e.target.value,
                })
              }
              className="p-2 w-full border rounded-md"
            />
          </div>
        ));
      case "audio":
        return Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <input
              type="file"
              onChange={(e) =>
                handleFileChange(`option_audio${index + 1}`, e.target.files[0])
              }
              className="p-2 border w-full rounded-md"
            />
            {answers[`option_audio${index + 1}`] && (
              <audio controls>
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
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <input
              type="file"
              accept="image/*"
              name={`option_image${index + 1}`}
              onChange={(e) =>
                handleFileChange(`option_image${index + 1}`, e.target.files[0])
              }
              className="p-2 border rounded-md"
            />
            {answers[`option_image${index + 1}`] && (
              <img
                src={URL.createObjectURL(answers[`option_image${index + 1}`])}
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

  const filteredDropdownOptions = Object.entries(answers)
    .filter(
      ([key, value]) =>
        key.startsWith("option") && value !== null && value !== ""
    )
    .map(([key]) => key);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizid) {
      toast.error("Please select a quiz.");
      return;
    }

    if (!question.questions || !answers.correct_answer) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("questions", question.questions);
    formData.append("sub_question", question.sub_question);
    formData.append("question_table", question.question_table);
    if (question.question_img) {
      formData.append("question_img", question.question_img);
    }
    if (question.question_audio) {
      formData.append("question_audio", question.question_audio);
    }
    formData.append("quize", quizid);

    formData.append("option1", answers.option1);
    formData.append("option2", answers.option2);
    formData.append("option3", answers.option3);
    formData.append("option4", answers.option4);
    if (answers.option_image1) {
      formData.append("option_image1", answers.option_image1);
    }
    if (answers.option_image2) {
      formData.append("option_image2", answers.option_image2);
    }
    if (answers.option_image3) {
      formData.append("option_image3", answers.option_image3);
    }
    if (answers.option_image4) {
      formData.append("option_image4", answers.option_image4);
    }
    if (answers.option_audio1) {
      formData.append("option_audio1", answers.option_audio1);
    }
    if (answers.option_audio2) {
      formData.append("option_audio2", answers.option_audio2);
    }
    if (answers.option_audio3) {
      formData.append("option_audio3", answers.option_audio3);
    }
    if (answers.option_audio4) {
      formData.append("option_audio4", answers.option_audio4);
    }
    formData.append("correct_answer", answers.correct_answer);

    try {
      const response = await fetch(
        "https://aasu.pythonanywhere.com/question/answer/create/",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${user.token.access}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Question and answer added successfully!");
        // Reset the question and answers state to initial states
        setQuestion(initialQuestionState);
        setAnswers(initialAnswersState);
        setFormSubmitted(!formSubmitted); // Toggle formSubmitted to trigger useEffect
      } else {
        toast.error("Failed to add question and answer.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add Question</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Question</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="mr-4 w-32">Quiz:</label>
                <select
                  value={quizid}
                  onChange={handleDropdownChange}
                  className="p-2 border rounded-md"
                >
                  <option value="">Select a Quiz</option>
                  {data &&
                    data.map((quiz) => (
                      <option key={quiz.id} value={quiz.id}>
                        {quiz.heading}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <p>
                  Number of Questions:
                  {numberOfQuestions}
                </p>
              </div>
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
                <label className="mr-4 w-32">Sub Questions:</label>
                <input
                  type="text"
                  name="sub_question"
                  value={question.sub_question}
                  onChange={handleQuestionChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Table:</label>
                <ReactQuill
                  value={question.question_table}
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
                  className="p-2 border rounded-md"
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
                  className="p-2 border rounded-md"
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
}

export default AddQuestion;

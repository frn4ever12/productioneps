import React, { useState, useEffect } from "react";
import { useGET } from "../Hooks/useApi";
import Loading from "../Components/Loading/Loading";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../Hooks/UseAuth";

const QuestionList = () => {
  const { user } = useAuth();
  const { data: quizData, isLoading: isQuizLoading } = useGET("quize/");
  const [selectedId, setSelectedId] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);

  const handleDropdownChange = (event) => {
    setSelectedId(event.target.value);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedId) {
        setIsQuestionLoading(true);
        try {
          const response = await axios.get(
            `https://aasu.pythonanywhere.com/question/list/${selectedId}/`,
            {
              headers: {
                Authorization: `Bearer ${user.token.access}`,
              },
            }
          );
          setQuestionData(response.data);
        } catch (error) {
          toast.error("Failed to fetch questions.");
        } finally {
          setIsQuestionLoading(false);
        }
      } else {
        setQuestionData([]);
      }
    };
    fetchQuestions();
  }, [selectedId, user.token.access]);

  const handleDelete = async (questionId) => {
    try {
      await axios.delete(
        `https://aasu.pythonanywhere.com/question/delete/${questionId}/`,
        {
          headers: {
            Authorization: `Bearer ${user.token.access}`,
          },
        }
      );

      toast.success("Question deleted successfully!");
      setQuestionData(
        questionData.filter((question) => question.id !== questionId)
      );
    } catch (error) {
      toast.error("Failed to delete question.");
    }
  };

  const handleEdit = (question) => {
    localStorage.setItem("selectedQuestion", JSON.stringify(question));
  };

  if (isQuizLoading) {
    return <Loading />;
  }

  return (
    <div className="question-list-container px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-700 sans-serif-text text-3xl ml-20">
          Questions List
        </div>
        <div className="flex items-center mr-20">
          <label
            htmlFor="quizSelect"
            className="block mb-2 font-semibold text-lg text-gray-800 mr-2"
          >
            Select Quiz:
          </label>
          <select
            id="quizSelect"
            onChange={handleDropdownChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            style={{ width: "400px" }}
          >
            <option value="">Select Quiz</option>
            {quizData.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.heading}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isQuestionLoading ? (
        <Loading />
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-1 mx-20">
          {questionData.length === 0 ? (
            <div>No questions available for the selected quiz.</div>
          ) : (
            questionData.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div>
                  <h1 className="text-lg text-gray-700 font-bold mb-4">
                    Question Number: {index + 1}
                  </h1>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 ">
                    {question.questions}
                    <br />
                    {question.sub_question}
                    <div className="mt-6 flex items-center">
                      {question.question_img && (
                        <img
                          src={
                            "https://aasu.pythonanywhere.com" +
                            question.question_img
                          }
                          alt="Question Image"
                          className="mt-2 h-40 w-auto"
                        />
                      )}
                      {question.question_audio && (
                        <audio
                          controls
                          className="ml-36"
                          src={
                            "https://aasu.pythonanywhere.com" +
                            question.question_audio
                          }
                        >
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                    {question.question_table}
                  </h2>
                </div>

                <hr className="my-4 border-t border-gray-300" />
                <div>
                  <h1 className="text-lg text-gray-700 font-bold mb-2">
                    Answers:
                  </h1>
                </div>
                <ul>
                  {question.answer.map((answer) => (
                    <li key={answer.id} className="mb-2">
                      <div className="flex flex-wrap justify-between ml-4">
                        {answer.option1 && (
                          <div className="w-1/2 p-2">
                            <strong>Option 1:</strong> {answer.option1}
                          </div>
                        )}
                        {answer.option2 && (
                          <div className="w-1/2 p-2">
                            <strong>Option 2:</strong> {answer.option2}
                          </div>
                        )}
                        {answer.option3 && (
                          <div className="w-1/2 p-2">
                            <strong>Option 3:</strong> {answer.option3}
                          </div>
                        )}
                        {answer.option4 && (
                          <div className="w-1/2 p-2">
                            <strong>Option 4:</strong> {answer.option4}
                          </div>
                        )}
                      </div>

                      {/* Image Part */}
                      <div className="flex flex-wrap justify-between ml-4">
                        {answer.option_image1 && (
                          <div className="w-1/2 p-2">
                            <strong>Option Image 1:</strong>
                            <img
                              src={
                                "https://aasu.pythonanywhere.com" +
                                answer.option_image1
                              }
                              alt="Option Image 1"
                              className="mt-2 h-40 w-auto"
                            />
                          </div>
                        )}
                        {answer.option_image2 && (
                          <div className="w-1/2 p-2">
                            <strong>Option Image 2:</strong>
                            <img
                              src={
                                "https://aasu.pythonanywhere.com" +
                                answer.option_image2
                              }
                              alt="Option Image 2"
                              className="mt-2 h-40 w-auto"
                            />
                          </div>
                        )}
                        {answer.option_image3 && (
                          <div className="w-1/2 p-2">
                            <strong>Option Image 3:</strong>
                            <img
                              src={
                                "https://aasu.pythonanywhere.com" +
                                answer.option_image3
                              }
                              alt="Option Image 3"
                              className="mt-2 h-40 w-auto"
                            />
                          </div>
                        )}
                        {answer.option_image4 && (
                          <div className="w-1/2 p-2">
                            <strong>Option Image 4:</strong>
                            <img
                              src={
                                "https://aasu.pythonanywhere.com" +
                                answer.option_image4
                              }
                              alt="Option Image 4"
                              className="mt-2 h-40 w-auto"
                            />
                          </div>
                        )}
                      </div>

                      {/* Audio Part */}
                      <div className="flex flex-wrap justify-between ml-4">
                        {answer.option_audio1 && (
                          <div className="w-1/2 p-2">
                            <strong>Option Audio 1:</strong>
                            <audio
                              controls
                              className="mt-2"
                              src={
                                "https://aasu.pythonanywhere.com" +
                                answer.option_audio1
                              }
                            >
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                        {answer.option_audio2 && (
                          <div className="w-1/2 p-2">
                            <strong>Option Audio 2:</strong>
                            <audio
                              controls
                              className="mt-2"
                              src={
                                "https://aasu.pythonanywhere.com" +
                                answer.option_audio2
                              }
                            >
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                        {answer.option_audio3 && (
                          <div className="w-1/2 p-2">
                            <strong>Option Audio 3:</strong>
                            <audio
                              controls
                              className="mt-2"
                              src={
                                "https://aasu.pythonanywhere.com" +
                                answer.option_audio3
                              }
                            >
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                        {answer.option_audio4 && (
                          <div className="w-1/2 p-2">
                            <strong>Option Audio 4:</strong>
                            <audio
                              controls
                              className="mt-2"
                              src={
                                "https://aasu.pythonanywhere.com" +
                                answer.option_audio4
                              }
                            >
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Correct Answer Part */}
                <div className="mt-6">
                  <strong>Correct Answer:</strong>{" "}
                  {question.answer.map((answer) => (
                    <span className="text-lg" key={answer.id}>
                      {answer.correct_answer}
                    </span>
                  ))}
                </div>

                <div className="flex justify-end mt-4">
                  <NavLink
                    to={`/updatequestionanswer/${question.id}`}
                    onClick={() => handleEdit(question)}
                  >
                    <button className="mr-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
                      Edit
                    </button>
                  </NavLink>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionList;

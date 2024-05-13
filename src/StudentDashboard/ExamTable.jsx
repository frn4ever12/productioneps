import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { useGET } from "../Hooks/useApi";
import { useParams } from "react-router-dom";
import { useAuth } from "../Hooks/UseAuth";
import ExamPopup from "./Components/ExamPopup";
import { useNavigate } from "react-router-dom";
import InstantResult from "./Components/instantResult";

const ExamTable = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const { data, isLoading } = useGET(`question/list/${id}/`);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionModel, setQuestionModel] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // State to store selected answers for each question
  const [solved, setSolved] = useState(0); // State to store the number of solved questions
  const [unsolved, setUnsolved] = useState(0); // State to store the number of unsolved questions
  const [remainingTime, setRemainingTime] = useState(30 * 60);

  useEffect(() => {
    if (data) {
      setTotalQuestions(data.length);
      // Initialize selectedAnswers state with null for each question
      const initialSelectedAnswers = {};
      data.forEach((question) => {
        initialSelectedAnswers[question.id] = null;
      });
      setSelectedAnswers(initialSelectedAnswers);
    }
  }, [data]);

  const handleClick = (index) => {
    setSelectedQuestionIndex(index);
    setQuestionModel(false);
  };

  const totalQuestion = () => {
    setQuestionModel(true);
    sendAnswerRequest("next");
  };

  const goToPreviousQuestion = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
      sendAnswerRequest("next");
    }
  };

  const goToNextQuestion = () => {
    if (selectedQuestionIndex < totalQuestions - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
      sendAnswerRequest("next");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const SubmitModel = async () => {
    try {
      const endpoint = `https://aasu.pythonanywhere.com/answer/check/`;

      // Prepare payload to send to the API
      const payload = {
        quiz_id: id,
        answers: Object.entries(selectedAnswers).map(
          ([question_id, selected_option]) => ({
            question_id,
            selected_option,
          })
        ),
      };

      // Send answer to the API
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${user.token.access}`, // Include user token
        },
      });
      const scoreresult = response.data;
      setScore(scoreresult);

      // console.log("Answer submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting answer:", error);
      // Handle the error here, e.g., display an error message to the user
    }
  };

  // Calculate the unsolved count by subtracting the solved count from the total questions
  useEffect(() => {
    setUnsolved(totalQuestions - solved);
  }, [totalQuestions, solved]);

  // Update remaining time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate minutes and seconds from remaining time
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const handleAnswerSelection = (key) => {
    const questionId = data[selectedQuestionIndex].id;

    if (selectedAnswers.hasOwnProperty(questionId)) {
      if (selectedAnswers[questionId] !== key) {
        setSelectedAnswers((prevState) => ({
          ...prevState,
          [questionId]: key,
        }));
        if (key !== null) {
          setSolved((prevState) => prevState + 1);
        }
      }
    } else {
      setSelectedAnswers((prevState) => ({
        ...prevState,
        [questionId]: key,
      }));
      if (key !== null) {
        setSolved((prevState) => prevState + 1);
      }
    }
  };

  const sendAnswerRequest = async (action) => {
    try {
      const endpoint = `https://aasu.pythonanywhere.com/answer/check1/${action}/`;

      const payload = {
        quiz_id: id,
        answers: [
          {
            question_id: data[selectedQuestionIndex].id,
            selected_option: selectedAnswers[data[selectedQuestionIndex].id],
          },
        ],
      };

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${user.token.access}`,
        },
      });

      // console.log("Answer submitted successfully:", response.data);
      // Extract score from response data
      // Store the score in a state variable, e.g., setScore(score);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available.</div>;
  }

  const selectedQuestion = data[selectedQuestionIndex];
  const firstHalf = data.slice(0, 20);
  const secondHalf = data.slice(20, 40);

  return (
    <>
      <div className="flex w-full rotate h-[full] flex-col justify-center items-center ">
        <div className="lg:mx-[10%] lg:w-[60rem] md:w-[55rem] w-[43rem] h-[full] rotate-90 lg:rotate-0 pb-full lg:mt-[3rem] mt-[40%] items-center p-6 border-2 border-solid border-black">
          <div className="p-2 lg:text-[19px] h-full flex w-full justify-center items-center gap-[10%] bg-blue-400">
            <p>Total number of questions: {totalQuestions}</p>
            <p>Solved: {solved}</p>
            <p>Unsolved: {unsolved}</p>
            {/* <p>Remaining time: {remainingTime}</p> */}
            <p className="ml-10">
              Remaining time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>
          </div>
          <div className="m-4 min-h-[10rem]">
            {questionModel ? (
              <table>
                <thead>
                  <tr className="mt-3">
                    <th className="lg:text-[29px] md:text-[26px]">Questions</th>
                  </tr>
                </thead>
                <tbody className="flex">
                  <div className="m-4 flex-1 w-auto flex flex-wrap gap-[0.5rem] border-2 border-solid border-black">
                    <div>
                      <div className="flex lg:text-[22px] md:text-[18px] flex-col justify-center items-center">
                        Listning Question
                      </div>
                      <div className="lg:m-2 md:m-1 flex-1 w-auto flex flex-wrap lg:gap-[0.5rem] md:gap-[0.3rem] ">
                        {firstHalf.map((question, index) => (
                          <tr
                            className="m-1"
                            key={index}
                            onClick={() => handleClick(index)}
                            style={{
                              backgroundColor: selectedAnswers[question.id]
                                ? "#2596be"
                                : "transparent",
                            }}
                          >
                            <td className="flex p-1 items-center justify-center h-auto lg:w-[5rem] md:w-[3rem] w-[2rem] cursor-pointer border-2 border-solid border-black">
                              <div className="flex">{question.id}</div>
                            </td>
                          </tr>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Second half of the data */}
                  <div className="m-4 flex-1 overflow-hidden w-auto flex flex-wrap gap-[0.5rem] border-2 border-solid border-black">
                    <div>
                      <div className="flex lg:text-[22px] md:text-[18px] flex-col justify-center items-center">
                        Reading Question
                      </div>
                      <div className="lg:m-2 md:m-1 flex-1 w-auto flex flex-wrap lg:gap-[0.5rem] md:gap-[0.3rem] ">
                        {secondHalf.map((question, index) => (
                          <tr
                            className="m-1 overflow-hidden "
                            key={index}
                            onClick={() => handleClick(index + 20)}
                            style={{
                              backgroundColor: selectedAnswers[question.id]
                                ? "#2596be"
                                : "transparent ",
                            }}
                          >
                            <td className="flex p-1 items-center justify-center h-auto lg:w-[5rem] md:w-[3rem] w-[2rem]  cursor-pointer border-2 border-solid border-black">
                              <div className="flex h-auto">{question.id}</div>
                            </td>
                          </tr>
                        ))}
                      </div>
                    </div>
                  </div>
                </tbody>
                <div className="flex justify-end items-center flex-1/2 w-full">
                  <button
                    onClick={() => setModalOpen(!modalOpen)}
                    className="flex flex-1/2 bg-blue-400 p-2 rounded-xl hover:bg-blue-600"
                  >
                    Submit Answer
                  </button>
                </div>
              </table>
            ) : (
              <div>
                <div className="flex">
                  <div className="flex h-[30vh] overflow-y-auto flex-1 flex-col gap-[1rem]">
                    <p className="flex text-[22px]">
                      {selectedQuestion.questions}
                    </p>
                    {selectedQuestion.question_audio !== null &&
                      selectedQuestion.question_audio !== undefined &&
                      selectedQuestion.question_audio !== 0 && (
                        <audio controls>
                          <source
                            src={
                              "https://aasu.pythonanywhere.com" +
                              selectedQuestion.question_audio
                            }
                            type="audio/mpeg"
                          />
                        </audio>
                      )}
                    {selectedQuestion.question_img !== null &&
                      selectedQuestion.question_img !== undefined &&
                      selectedQuestion.question_img !== 0 && (
                        <p className="  w-full  p-1 ">
                          <img
                            className="h-45"
                            src={
                              "https://aasu.pythonanywhere.com" +
                              selectedQuestion.question_img
                            }
                            alt="hello"
                          />
                        </p>
                      )}
                  </div>
                  <div className="w-full h-[30vh] overflow-y-auto flex-1 ">
                    <div className="flex w-full  flex-col items-center justify-center gap-[1rem]">
                      {selectedQuestion.answer.map((answer) => (
                        <div
                          key={answer.id}
                          className="flex flex-col w-full gap-[1rem] p-6 text-[18px]"
                        >
                          {Object.keys(answer).map((key) => {
                            if (key.startsWith("option") && answer[key]) {
                              if (key.startsWith("option_audio")) {
                                // Audio option
                                return (
                                  <label
                                    key={key}
                                    className="border-b flex gap-[20px] hover:bg-gray-200 w-full border-gray-400 p-1 pl-8"
                                  >
                                    <input
                                      type="radio"
                                      name={`answer-${answer.id}`}
                                      onChange={() =>
                                        handleAnswerSelection(key)
                                      }
                                      checked={
                                        selectedAnswers[selectedQuestion.id] ===
                                        key
                                      }
                                    />
                                    <audio controls>
                                      <source
                                        src={
                                          "https://aasu.pythonanywhere.com" +
                                          answer[key]
                                        }
                                        type="audio/mpeg"
                                      />
                                    </audio>
                                  </label>
                                );
                              } else if (key.startsWith("option_imag")) {
                                // Image option
                                return (
                                  <label
                                    key={key}
                                    className="border-b  gap-[20px] flex hover:bg-gray-200 w-full border-gray-400 p-1 pl-8"
                                  >
                                    <input
                                      type="radio"
                                      name={`answer-${answer.id}`}
                                      onChange={() =>
                                        handleAnswerSelection(key)
                                      }
                                      checked={
                                        selectedAnswers[selectedQuestion.id] ===
                                        key
                                      }
                                    />
                                    <img
                                      className="h-40"
                                      src={
                                        "https://aasu.pythonanywhere.com" +
                                        answer[key]
                                      }
                                      alt="hello"
                                    />
                                  </label>
                                );
                              } else {
                                // Text option
                                return (
                                  <label
                                    key={key}
                                    className="border-b  gap-[20px] flex  hover:bg-gray-200 w-full border-gray-400 p-1 pl-8"
                                  >
                                    <input
                                      type="radio"
                                      name={`answer-${answer.id}`}
                                      onChange={() =>
                                        handleAnswerSelection(key)
                                      }
                                      checked={
                                        selectedAnswers[selectedQuestion.id] ===
                                        key
                                      }
                                    />
                                    {answer[key]}
                                  </label>
                                );
                              }
                            }
                            return null;
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-[2%]">
                  <button
                    className="h-[2.3rem] w-[6.2rem] hover:bg-gray-200 border-2 border-solid border-gray-400 p-1 rounded-xl"
                    onClick={goToPreviousQuestion}
                  >
                    Previous
                  </button>
                  <div className="gap-[10%] flex flex-1/2 w-full justify-center items-center">
                    <p
                      className="bg-blue-400 p-2 rounded-xl hover:bg-blue-600"
                      onClick={totalQuestion}
                    >
                      Total Question
                    </p>
                  </div>
                  <button
                    className="h-[2.3rem] w-[6.2rem] hover:bg-gray-200 border-2 border-solid border-gray-400 p-1 rounded-xl"
                    onClick={goToNextQuestion}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ExamPopup
        isOpen={modalOpen}
        // score={score}
        onclick={SubmitModel}
        setIsOpen={setModalOpen}
      />
      {score && <InstantResult scoreresult={score} />}
    </>
  );
};

export default ExamTable;

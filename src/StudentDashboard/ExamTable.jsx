import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import Axios
import { useGET } from "../Hooks/useApi";
import { useParams } from "react-router-dom";
import { useAuth } from "../Hooks/UseAuth";
import ExamPopup from "./Components/ExamPopup";

import InstantResult from "./Components/instantResult";
import DOMPurify from "dompurify";

const ExamTable = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [score, setScore] = useState(null);
  const { data, isLoading } = useGET(`question/list/${id}/`);
  const { data: time } = useGET(`quize/${id}/`);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionModel, setQuestionModel] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // State to store selected answers for each question
  const [solved, setSolved] = useState(0); // State to store the number of solved questions
  const [unsolved, setUnsolved] = useState(0); // State to store the number of unsolved questions
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState({});
  const [answerAudioPlayed, setAnswerAudioPlayed] = useState({});
  const [isPlayed, setIsPlayed] = useState(false);

  const playAnswerSound = (questionId, key) => {
    const audioElement = document.getElementById(`audio-${questionId}-${key}`);
    if (audioElement) {
      audioElement.play();
      setAnswerAudioPlayed((prev) => ({
        ...prev,
        [`${questionId}-${key}`]: true,
      }));
    }
  };
  const playSound = () => {
    audioRef.current.play();
    setIsPlayed(true);
    setAudioPlayed((prev) => ({
      ...prev,
      [selectedQuestion.id]: true,
    }));
  };
  // const playSound = () => {
  //   audioRef.current.play();
  //   setIsPlayed(true);
  // };
  let optionIndex = 0;
  const [timeRemaining, setTimeRemaining] = useState(null);
  useEffect(() => {
    if (timeRemaining === 0) {
      SubmitModel();
    }
  }, [timeRemaining]);

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

  useEffect(() => {
    if (time && time.time_duration) {
      const initialTime = parseTime(time.time_duration);
      setTimeRemaining(initialTime);
    }
  }, [time]);

  useEffect(() => {
    if (timeRemaining !== null) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const parseTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

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

  // Calculate minutes and seconds from remaining time

  const handleAnswerSelection = (key) => {
    const questionId = data[selectedQuestionIndex].id;

    // Check if the question was previously unanswered
    const wasUnanswered = selectedAnswers[questionId] === null;

    // Update selected answer
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionId]: key,
    }));

    // Update solved count only if the question was previously unanswered
    if (wasUnanswered) {
      setSolved((prevSolved) => prevSolved + 1);
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
    <div className="w-full h-full">
      <div className="flex w-full rotate h-full flex-col justify-center items-center ">
        <div className="lg:mx-[10%] lg:w-[60rem] md:w-[55rem] w-[40rem] lg:h-full rotate-90 lg:rotate-0  lg:mt-[3rem] md:mt-[40%] mt-[46%] items-center md:p-6 p-3 border-2 border-solid border-black">
          <div className="p-2 text-[19px] flex w-full justify-center items-center gap-[10%] bg-blue-400">
            <p>Solved: {solved}</p>
            <p>Unsolved: {unsolved}</p>

            <p className="">Remaining time: {formatTime(timeRemaining)}</p>
          </div>
          <div className=" h-full w-full">
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
                        Reading Question
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
                              <div className="flex">{index + 1}</div>
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
                        Listening Question
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
                              <div className="flex h-auto">{index + 21}</div>
                            </td>
                          </tr>
                        ))}
                      </div>
                    </div>
                  </div>
                </tbody>
                <div className="flex justify-end items-center p-4 flex-1/2 w-full">
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
                  <div className="flex  lg:h-[30rem] md:h-[26rem] h-[14rem] w-full overflow-y-auto flex-1 flex-col gap-[1rem]">
                    <p className="flex text-[22px]">
                      {selectedQuestion.questions}
                    </p>
                    {selectedQuestion.sub_question !== null &&
                      selectedQuestion.sub_question !== undefined &&
                      selectedQuestion.sub_question !== 0 && (
                        <p className="flex  text-[22px]">
                          {selectedQuestion.sub_question}
                        </p>
                      )}
                    {selectedQuestion.question_table !== null &&
                      selectedQuestion.question_table !== undefined &&
                      selectedQuestion.question_table !== 0 && (
                        <p
                          className={`flex text-[22px] p-2 ${
                            selectedQuestion.question_table
                              ? "border-2 border-black"
                              : ""
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              selectedQuestion.question_table
                            ),
                          }}
                        ></p>
                      )}
                    {selectedQuestion.question_audio !== null &&
                      selectedQuestion.question_audio !== undefined &&
                      selectedQuestion.question_audio !== 0 && (
                        // <audio controls>
                        //   <source
                        //     src={
                        //       "https://aasu.pythonanywhere.com" +
                        //       selectedQuestion.question_audio
                        //     }
                        //     type="audio/mpeg"
                        //   />
                        // </audio>

                        <div>
                          <audio
                            ref={audioRef}
                            src={
                              "https://aasu.pythonanywhere.com" +
                              selectedQuestion.question_audio
                            }
                          />
                          <button
                            onClick={playSound}
                            disabled={audioPlayed[selectedQuestion.id]}
                            style={{
                              backgroundColor: audioPlayed[selectedQuestion.id]
                                ? "lightgrey"
                                : "blue",
                              color: audioPlayed[selectedQuestion.id]
                                ? "darkgrey"
                                : "white",
                              cursor: audioPlayed[selectedQuestion.id]
                                ? "not-allowed"
                                : "pointer",
                            }}
                          >
                            {audioPlayed[selectedQuestion.id]
                              ? "Played"
                              : "Play Sound"}
                          </button>
                        </div>
                      )}
                    {selectedQuestion.question_img !== null &&
                      selectedQuestion.question_img !== undefined &&
                      selectedQuestion.question_img !== 0 && (
                        <p className="  w-full  p-1 ">
                          <img
                            className="h-40"
                            src={
                              "https://aasu.pythonanywhere.com" +
                              selectedQuestion.question_img
                            }
                            alt="hello"
                          />
                        </p>
                      )}
                  </div>
                  <div className="w-full  lg:h-[30rem] md:h-[26rem] h-[14rem] overflow-y-auto flex-1 ">
                    <div className="flex w-full  flex-col items-center justify-center gap-[1rem]">
                      {selectedQuestion.answer.map((answer) => (
                        <div
                          key={answer.id}
                          className="flex flex-col w-full gap-[1rem] p-6 text-[18px]"
                        >
                          {Object.keys(answer).map((key) => {
                            if (key.startsWith("option") && answer[key]) {
                              optionIndex++;
                              if (key.startsWith("option_audio")) {
                                return (
                                  <label
                                    key={key}
                                    className="flex items-center gap-[20px] border-b border-gray-400 p-1 pl-8 hover:bg-gray-200 cursor-pointer"
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
                                      className="hidden"
                                    />
                                    <span
                                      className={`inline-block w-9 h-9 rounded-full border-2 border-solid border-[#1e7aa2] text-center leading-8 text-black ${
                                        selectedAnswers[selectedQuestion.id] ===
                                        key
                                          ? "bg-[#2596be] text-white"
                                          : ""
                                      }`}
                                    >
                                      {optionIndex}
                                    </span>
                                    <audio
                                      id={`audio-${selectedQuestion.id}-${key}`}
                                      controls
                                      className="hidden"
                                    >
                                      <source
                                        src={
                                          "https://aasu.pythonanywhere.com" +
                                          answer[key]
                                        }
                                        type="audio/mpeg"
                                      />
                                    </audio>
                                    <button
                                      onClick={() =>
                                        playAnswerSound(
                                          selectedQuestion.id,
                                          key
                                        )
                                      }
                                      disabled={
                                        answerAudioPlayed[
                                          `${selectedQuestion.id}-${key}`
                                        ]
                                      }
                                      style={{
                                        backgroundColor: answerAudioPlayed[
                                          `${selectedQuestion.id}-${key}`
                                        ]
                                          ? "lightgrey"
                                          : "blue",
                                        color: answerAudioPlayed[
                                          `${selectedQuestion.id}-${key}`
                                        ]
                                          ? "darkgrey"
                                          : "white",
                                        cursor: answerAudioPlayed[
                                          `${selectedQuestion.id}-${key}`
                                        ]
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                    >
                                      {answerAudioPlayed[
                                        `${selectedQuestion.id}-${key}`
                                      ]
                                        ? "Played"
                                        : "Play Sound"}
                                    </button>
                                  </label>
                                );
                              } else if (key.startsWith("option_imag")) {
                                return (
                                  <label
                                    key={key}
                                    className="flex items-center gap-[20px] border-b border-gray-400 p-1 pl-8 hover:bg-gray-200 cursor-pointer"
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
                                      className="hidden"
                                    />
                                    <span
                                      className={`inline-block w-9 h-9 rounded-full border-2 border-solid border-[#1e7aa2] text-center leading-8 text-black ${
                                        selectedAnswers[selectedQuestion.id] ===
                                        key
                                          ? "bg-[#2596be] text-white"
                                          : ""
                                      }`}
                                    >
                                      {/* {index + 1} */}
                                      {optionIndex}
                                    </span>
                                    <img
                                      className="h-[8rem]"
                                      src={
                                        "https://aasu.pythonanywhere.com" +
                                        answer[key]
                                      }
                                      alt="hello"
                                    />
                                  </label>
                                );
                              } else {
                                return (
                                  <label
                                    key={key}
                                    className="flex items-center gap-[20px] border-b border-gray-400 p-1 pl-8 hover:bg-gray-200 cursor-pointer"
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
                                      className="hidden"
                                    />
                                    <span
                                      className={`inline-block w-9 h-9 rounded-full border-2 border-solid border-[#1e7aa2] text-center leading-8 text-black ${
                                        selectedAnswers[selectedQuestion.id] ===
                                        key
                                          ? "bg-[#2596be] text-white"
                                          : ""
                                      }`}
                                    >
                                      {optionIndex}
                                    </span>
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
                <div className="flex justify-center items-center p-3 gap-[2%]">
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
      {/* {timeExpired && (
        <ExamPopup
          isOpen={modalOpen}
          onclick={SubmitModel}
          setIsOpen={setModalOpen}
        />
      )} */}
      <ExamPopup
        isOpen={modalOpen}
        // score={score}
        onclick={SubmitModel}
        setIsOpen={setModalOpen}
      />
      {score && <InstantResult scoreresult={score} />}
    </div>
  );
};

export default ExamTable;

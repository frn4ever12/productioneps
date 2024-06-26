import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import Axios
import { useGET } from "../Hooks/useApi";
import { useParams } from "react-router-dom";
import { useAuth } from "../Hooks/UseAuth";
import ExamPopup from "./Components/ExamPopup";
import img1 from "../Image/file.png";
import InstantResult from "./Components/instantResult";
import DOMPurify from "dompurify";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeadphones } from "react-icons/fa";
import Loading from "../Components/Loading/Loading";

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
  const [isSubbmitLoading, setIsSubbmitLoading] = useState();
  const [audioPlaying, setAudioPlaying] = useState(false);
  const playAnswerSound = (questionId, key) => {
    if (answerAudioPlayed[`${questionId}-${key}`]) return; // If already played, return

    const audioElement = document.getElementById(`audio-${questionId}-${key}`);

    if (!audioElement || audioPlaying) return; // If audio is already playing, return

    setAudioPlaying(true);

    audioElement.play();

    audioElement.onended = () => {
      setAudioPlaying(false);
      setAnswerAudioPlayed((prev) => ({
        ...prev,
        [`${questionId}-${key}`]: true,
      }));

      // Disable the audio button after it has been played once
      const audioButton = document.getElementById(
        `button-${questionId}-${key}`
      );
      audioButton.disabled = true;
      audioButton.classList.add("played"); // Add the 'played' class to the audio button
    };

    // Disable all other audio buttons while one is playing
    const allButtons = document.querySelectorAll(".audio-play-button");
    allButtons.forEach((button) => {
      button.disabled = true;
      button.classList.remove("played"); // Remove the 'played' class from other buttons
    });
  };

  const playSound = () => {
    if (audioPlayed[selectedQuestion.id]) return;

    const audioElement = audioRef.current;
    if (audioElement) {
      setAudioPlaying(true);
      audioElement.play();
      audioElement.onended = () => {
        setAudioPlaying(false);
        setIsPlayed(true);
        setAudioPlayed((prev) => ({
          ...prev,
          [selectedQuestion.id]: true,
        }));

        const allButtons = document.querySelectorAll(".audio-play-button");
        allButtons.forEach((button) => {
          button.disabled = false;
          button.style.cursor = "pointer";
          button.style.backgroundColor = "#61a4fa";
        });
      };

      const allButtons = document.querySelectorAll(".audio-play-button");
      allButtons.forEach((button) => {
        if (button.id !== `button-${selectedQuestion.id}`) {
          button.disabled = true;
          button.style.cursor = "not-allowed";
          button.style.backgroundColor = "lightgrey";
        }
      });
    }
  };

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
    setIsSubbmitLoading(true);
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
    } finally {
      setIsSubbmitLoading(false);
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
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div>No data available.</div>;
  }

  const selectedQuestion = data[selectedQuestionIndex];

  const firstHalf = data.slice(0, 20);
  const secondHalf = data.slice(20, 40);

  return (
    <div className="w-screen h-screen">
      <div className="flex w-screen h-screen flex-col justify-center items-center ">
        <div
          className=" lg:mx-[10%] lg:w-[60rem] md:w-[58rem] w-[50rem] bg-opacity-5 h-auto   rotate-90 lg:rotate-0  lg:mt-[-5rem]  items-center  md:p-6 p-2 border-2 border-solid border-black"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${img1})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className="p-2 lg:text-[19px] text-[17px] flex w-full justify-center items-center md:gap-[10%] gap-9  bg-blue-400">
            <p>Total Question: {data.length}</p>
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
                  <div className="lg:m-4 m-2 flex-1 w-auto flex flex-wrap gap-[0.5rem] border-2 border-solid border-black ">
                    <div>
                      <div className="flex  lg:text-[22px] md:text-[18px] flex-col justify-center items-center">
                        Reading Question
                      </div>
                      <div className="lg:m-2 md:m-1 flex-1 w-auto flex flex-wrap items-center justify-center lg:gap-[0.5rem] md:gap-[0.3rem] ">
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
                            <td className="flex p-1 items-center justify-center h-auto lg:w-[5rem]  w-[4.5rem] cursor-pointer border-2 border-solid border-black">
                              <div className="flex">{index + 1}</div>
                            </td>
                          </tr>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Second half of the data */}
                  <div className="lg:m-4 m-2 flex-1 w-auto flex flex-wrap gap-[0.5rem] border-2 border-solid border-black ">
                    <div>
                      <div className="flex lg:text-[22px] md:text-[18px] flex-col justify-center items-center">
                        Listening Question
                      </div>
                      <div className="lg:m-2 md:m-1 flex-1 w-auto flex flex-wrap items-center justify-center lg:gap-[0.5rem] md:gap-[0.3rem] ">
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
                            <td className="flex p-1 items-center justify-center h-auto lg:w-[5rem] w-[4.5rem]  cursor-pointer border-2 border-solid border-black">
                              <div className="flex h-auto">{index + 21}</div>
                            </td>
                          </tr>
                        ))}
                      </div>
                    </div>
                  </div>
                </tbody>
                <div className="flex justify-end items-center lg:p-4 flex-1/2 w-full">
                  <button
                    onClick={() => setModalOpen(!modalOpen)}
                    className="flex flex-1/2 bg-blue-400 p-2 lg:text-[18px] text-[16px] rounded-xl hover:bg-blue-600"
                  >
                    Submit Answer
                  </button>
                </div>
              </table>
            ) : (
              <div>
                <div className="lg:p-3 p-1">
                  <p className="flex text-[22px]">
                    {selectedQuestion.questions}
                  </p>
                </div>
                <div className="flex w-full border-2 border-solid border-black ">
                  <div className="flex lg:p-3 p-1 lg:h-[30rem] md:h-[26rem] h-[14rem] w-full overflow-y-auto flex-1 flex-col lg:gap-[1rem] gap-[0.2rem]  border-r-2 border-solid border-black">
                    {selectedQuestion.sub_question !== null &&
                      selectedQuestion.sub_question !== undefined &&
                      selectedQuestion.sub_question !== 0 && (
                        <p className="flex  lg:text-[22px] text-[18px]">
                          {selectedQuestion.sub_question}
                        </p>
                      )}
                    {selectedQuestion.question_table !== null &&
                      selectedQuestion.question_table !== undefined &&
                      selectedQuestion.question_table !== 0 && (
                        <p
                          className={`flex text-[22px] lg:p-2 p-1 ${
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
                            className="p-2 rounded-xl"
                            onClick={playSound}
                            disabled={
                              audioPlayed[selectedQuestion.id] || audioPlaying
                            }
                            style={{
                              backgroundColor: audioPlayed[selectedQuestion.id]
                                ? "lightgrey"
                                : "#61a4fa",
                              color: audioPlayed[selectedQuestion.id]
                                ? "darkgrey"
                                : "white",
                              cursor: audioPlayed[selectedQuestion.id]
                                ? "not-allowed"
                                : "pointer",
                            }}
                          >
                            {audioPlayed[selectedQuestion.id] ? (
                              <FaCirclePlay className="md:text-[4rem] text-[2rem]" />
                            ) : (
                              <FaCirclePlay className="md:text-[4rem] text-[2rem]" />
                            )}
                          </button>
                        </div>
                      )}
                    {selectedQuestion.question_img !== null &&
                      selectedQuestion.question_img !== undefined &&
                      selectedQuestion.question_img !== 0 && (
                        <p className="  w-full  ">
                          <img
                            className="lg:h-60 h-40"
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
                    <div className="flex w-full  flex-col items-center justify-center lg:gap-[1rem] gap-[0.5rem]">
                      {selectedQuestion.answer.map((answer) => (
                        <div
                          key={answer.id}
                          className="flex flex-col w-full  lg:text-[18px] text-[16px] "
                        >
                          {Object.keys(answer).map((key) => {
                            if (key.startsWith("option") && answer[key]) {
                              optionIndex++;
                              if (key.startsWith("option_audio")) {
                                return (
                                  <div className="flex items-center lg:text-[25px] text-[20px] h-auto gap-[4%] border-b-2 border-black pl-3  hover:bg-gray-200 cursor-pointer">
                                    <label key={key}>
                                      <input
                                        type="radio"
                                        name={`answer-${answer.id}`}
                                        onChange={() =>
                                          handleAnswerSelection(key)
                                        }
                                        checked={
                                          selectedAnswers[
                                            selectedQuestion.id
                                          ] === key
                                        }
                                        className="hidden"
                                      />
                                      <span
                                        className={`inline-block  h-9  aspect-square rounded-full border-2 border-solid border-[#61a4fa] text-center leading-8 text-black ${
                                          selectedAnswers[
                                            selectedQuestion.id
                                          ] === key
                                            ? "bg-[#61a4fa] text-white"
                                            : ""
                                        }`}
                                      >
                                        {optionIndex}
                                      </span>
                                    </label>
                                    <div className="border-l-2 border-black lg:p-3 p-1">
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
                                      <p
                                        id={`button-${selectedQuestion.id}-${key}`}
                                        className={`audio-play-button p-2  rounded-xl ${
                                          answerAudioPlayed[
                                            `${selectedQuestion.id}-${key}`
                                          ]
                                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                            : "bg-blue-400 hover:bg-blue-600 cursor-pointer text-white"
                                        }`}
                                        onClick={() =>
                                          !answerAudioPlayed[
                                            `${selectedQuestion.id}-${key}`
                                          ] &&
                                          playAnswerSound(
                                            selectedQuestion.id,
                                            key
                                          )
                                        }
                                      >
                                        {answerAudioPlayed[
                                          `${selectedQuestion.id}-${key}`
                                        ] ? (
                                          <FaCirclePlay className="md:text-[4rem] text-[1.2rem]" />
                                        ) : (
                                          <FaCirclePlay className="md:text-[4rem] text-[1.2rem]" />
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                );
                              } else if (key.startsWith("option_imag")) {
                                return (
                                  <div className="flex items-center lg:text-[25px] text-[20px] h-auto gap-[4%] border-b-2 border-black pl-3  hover:bg-gray-200 cursor-pointer">
                                    <label key={key} className="">
                                      <input
                                        type="radio"
                                        name={`answer-${answer.id}`}
                                        onChange={() =>
                                          handleAnswerSelection(key)
                                        }
                                        checked={
                                          selectedAnswers[
                                            selectedQuestion.id
                                          ] === key
                                        }
                                        className="hidden"
                                      />
                                      <span
                                        className={`inline-block  h-9  aspect-square rounded-full border-2 border-solid border-[#61a4fa] text-center leading-8 text-black ${
                                          selectedAnswers[
                                            selectedQuestion.id
                                          ] === key
                                            ? "bg-[#61a4fa] text-white"
                                            : ""
                                        }`}
                                      >
                                        {/* {index + 1} */}
                                        {optionIndex}
                                      </span>
                                    </label>
                                    <p className="border-l-2 border-black lg:p-3 ">
                                      <img
                                        className="lg:h-[10rem] h-[7rem]"
                                        src={
                                          "https://aasu.pythonanywhere.com" +
                                          answer[key]
                                        }
                                        alt="hello"
                                      />
                                    </p>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="flex items-center lg:text-[25px]  text-[23px] h-auto gap-[4%] border-b-2 border-black pl-3 hover:bg-gray-200 cursor-pointer">
                                    <label key={key}>
                                      <input
                                        type="radio"
                                        name={`answer-${answer.id}`}
                                        onChange={() =>
                                          handleAnswerSelection(key)
                                        }
                                        checked={
                                          selectedAnswers[
                                            selectedQuestion.id
                                          ] === key
                                        }
                                        className="hidden "
                                      />
                                      <span
                                        className={`inline-block h-9  aspect-square rounded-full border-2 border-solid border-[#61a4fa] text-center  leading-8 text-black ${
                                          selectedAnswers[
                                            selectedQuestion.id
                                          ] === key
                                            ? "bg-[#61a4fa] text-white"
                                            : ""
                                        }`}
                                      >
                                        {optionIndex}
                                      </span>
                                    </label>
                                    <p className="border-l-2 border-black lg:p-3 p-[10px]">
                                      {answer[key]}
                                    </p>
                                  </div>
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
                <div className="flex justify-center items-center lg:px-3 px-2 lg:pt-3 pt-2 gap-[2%]">
                  <button
                    className="h-[2.3rem] w-[6.2rem] hover:bg-gray-200 border-2 border-solid border-black p-1 rounded-xl"
                    style={{
                      color: audioPlaying ? "grey" : "black",
                      cursor: audioPlaying ? "not-allowed" : "pointer",
                    }}
                    onClick={goToPreviousQuestion}
                    disabled={audioPlaying}
                  >
                    Previous
                  </button>
                  <div className="gap-[10%] flex flex-1/2 w-full justify-center items-center">
                    <button
                      className="bg-blue-400 p-2 rounded-xl hover:bg-blue-600"
                      style={{
                        color: audioPlaying ? "grey" : "black",
                        cursor: audioPlaying ? "not-allowed" : "pointer",
                      }}
                      onClick={totalQuestion}
                      disabled={audioPlaying}
                    >
                      Total Question
                    </button>
                  </div>
                  <button
                    className="h-[2.3rem] w-[6.2rem] hover:bg-gray-200 border-2 border-solid border-black p-1 rounded-xl"
                    style={{
                      color: audioPlaying ? "grey" : "black",
                      cursor: audioPlaying ? "not-allowed" : "pointer",
                    }}
                    disabled={audioPlaying}
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
        loading={isSubbmitLoading}
        onclick={SubmitModel}
        setIsOpen={setModalOpen}
      />
      {score && <InstantResult scoreresult={score} />}
    </div>
  );
};

export default ExamTable;

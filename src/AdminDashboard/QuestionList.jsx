import React, { useState, useEffect } from "react";
import { useGET } from "../Hooks/useApi";
import Loading from "../Components/Loading/Loading";

const QuestionList = () => {
  const { data: quizData, isLoading: isQuizLoading } = useGET("quize/");
  const [selectedId, setSelectedId] = useState(null);
  const {
    data: questionData,
    isLoading: isQuestionLoading,
    refetch: refetchQuestionData,
  } = useGET(`question/list/${selectedId}/`);

  const handleDropdownChange = (event) => {
    setSelectedId(event.target.value);
  };

  useEffect(() => {
    if (selectedId !== null) {
      refetchQuestionData();
    }
  }, [selectedId, refetchQuestionData]);

  if (isQuizLoading) {
    return <Loading />;
  }

  const handleEdit = (questionId) => {
    // Implement edit functionality here
    console.log("Edit question with ID:", questionId);
  };

  const handleDelete = (questionId) => {
    // Implement delete functionality here
    console.log("Delete question with ID:", questionId);
  };

  return (
    <div className="question-list-container">
      <div className="max-w-md mx-auto mt-8">
        <label
          htmlFor="quizSelect"
          className="block mb-2 font-semibold text-lg"
        >
          Select Quiz:
        </label>
        <select
          id="quizSelect"
          onChange={handleDropdownChange}
          className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="">Select Quiz</option>
          {quizData.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.heading}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-8">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Question ID</th>
              <th className="px-4 py-2">Question</th>
              <th className="px-4 py-2">Options</th>
              <th className="px-4 py-2">Correct Answer</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questionData &&
              questionData.map((question) => (
                <tr key={question.id}>
                  <td className="border px-4 py-2">{question.id}</td>
                  <td className="border px-4 py-2">{question.questions}</td>
                  <td className="border px-4 py-2">
                    <ul className="list-disc pl-4">
                      {question.answer.map((answer) => (
                        <li key={answer.id}>
                          {answer.option1}
                          <br />
                          {answer.option2}
                          <br />
                          {answer.option3}
                          <br />
                          {answer.option4}
                          <br />
                          {answer.option_image1 && (
                            <>
                              <img
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_image1
                                }
                                alt="option_image1"
                              />
                            </>
                          )}

                          {answer.option_image2 && (
                            <>
                              <img
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_image2
                                }
                                alt="option_image2"
                              />
                            </>
                          )}

                          {answer.option_image3 && (
                            <>
                              <img
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_image3
                                }
                                alt="option_image3"
                              />
                            </>
                          )}

                          {answer.option_audio1 && (
                            <>
                              <audio controls className="ml-4">
                                <source
                                  src={
                                    "https://aasu.pythonanywhere.com" +
                                    answer.option_audio1
                                  }
                                  type="audio/mp3"
                                />
                                Your browser does not support the audio element.
                              </audio>
                            </>
                          )}
                          {answer.option_audio2 && (
                            <>
                              <audio controls className="ml-4">
                                <source
                                  src={
                                    "https://aasu.pythonanywhere.com" +
                                    answer.option_audio2
                                  }
                                  type="audio/mp3"
                                />
                                Your browser does not support the audio element.
                              </audio>
                            </>
                          )}
                          {answer.option_audio3 && (
                            <>
                              <audio controls className="ml-4">
                                <source
                                  src={
                                    "https://aasu.pythonanywhere.com" +
                                    answer.option_audio3
                                  }
                                  type="audio/mp3"
                                />
                                Your browser does not support the audio element.
                              </audio>
                            </>
                          )}
                          {answer.option_audio4 && (
                            <>
                              <audio controls className="ml-4">
                                <source
                                  src={
                                    "https://aasu.pythonanywhere.com" +
                                    answer.option_audio4
                                  }
                                  type="audio/mp3"
                                />
                                Your browser does not support the audio element.
                              </audio>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">
                    {question.answer.map((answer) => (
                      <li key={answer.id}>{answer.correct_answer}</li>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(question.id)}
                      className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionList;

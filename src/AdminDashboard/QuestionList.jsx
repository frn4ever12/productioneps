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
        {questionData &&
          questionData.map((question) => (
            <div
              key={question.id}
              className="mb-8 p-4 bg-white shadow rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-2">
                Question ID: {question.id}
              </h3>
              <p className="mb-2">
                <span className="font-semibold">Question:</span>{" "}
                {question.questions}
              </p>
              <p className="mb-2 font-semibold">Answers:</p>
              <ul className="list-disc pl-6">
                {question.answer.map((answer) => (
                  <li key={answer.id}>
                    <b>Option 1:</b>
                    {answer.option1}
                    <br /> <b>Option 2:</b> {answer.option2},<br />
                    <b> Option 3:</b> {answer.option3}
                    <br /> <b>Option 4:</b>
                    {answer.option4}
                    <br />
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};

export default QuestionList;

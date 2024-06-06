import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../Components/Loading/Loading";
import { useAuth } from "../Hooks/UseAuth";

const QuizResults = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsQuizLoading(true);
      try {
        const response = await axios.get(
          "https://aasu.pythonanywhere.com/quize/"
        );
        setQuizzes(response.data);
      } catch (error) {
        toast.error("Failed to fetch quizzes.");
      } finally {
        setIsQuizLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [selectedQuizId, startDate, endDate, currentPage]);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      let url = "https://aasu.pythonanywhere.com/all/result/";
      const params = new URLSearchParams();

      if (selectedQuizId) {
        params.append("result", selectedQuizId);
      }
      if (startDate) {
        params.append("date_start", startDate);
      }
      if (endDate) {
        params.append("date_ended", endDate);
      }

      params.append("page", currentPage);

      const response = await axios.get(`${url}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${user.token.access}`,
        },
      });

      setResults(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      toast.error("Failed to fetch results.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedQuizId(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isQuizLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="text-gray-700 sans-serif-text text-3xl ml-1 mt-4">
          Results List
        </div>
        <div className="flex justify-between items-center mb-4 mt-4">
          <div className="flex items-center">
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
              style={{ width: "300px" }}
            >
              <option value="">All</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.heading}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <label
                htmlFor="startDate"
                className="block mb-2 font-semibold text-lg text-gray-800 mr-2"
              >
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block mb-2 font-semibold text-lg text-gray-800 mr-2"
              >
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={handleEndDateChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-auto shadow mx-26 mt-4">
            <table className="w-full mb-0">
              <thead className="bg-gray-100 text-left border-b-2 border-gray-700">
                <tr>
                  <th className="w-20 p-3 text-sm font-semibold">ID</th>
                  <th className="w-64 p-3 text-sm font-semibold">Name</th>
                  <th className="w-64 p-3 text-sm font-semibold">Quiz</th>
                  <th className="w-20 p-3 text-sm font-semibold">Result</th>
                  <th className="w-32 p-3 text-sm font-semibold">Percentage</th>
                  <th className="w-32 p-3 text-sm font-semibold">Solved</th>
                  <th className="w-32 p-3 text-sm font-semibold">Unsolved</th>
                  <th className="w-32 p-3 text-sm font-semibold">
                    Correct Answer
                  </th>
                  <th className="w-32 p-3 text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((result) => {
                  const [date, time] = result.created_at.split("T");
                  const formattedTime = time.split(".")[0];
                  return (
                    <tr
                      key={result.id}
                      className="bg-white border-r text-left border-b text-sm text-gray-600"
                    >
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {result.id}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {result.user}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {result.quize[0]?.heading ?? "N/A"}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {result.result}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {result.score}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {result.solved}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {result.unsolved}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {result.correct_answers}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(totalCount / 10) }, (_, index) => (
          <button
            key={index}
            className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default QuizResults;

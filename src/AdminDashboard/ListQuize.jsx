import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import { useAuth } from "../Hooks/UseAuth";
import Loading from "../Components/Loading/Loading";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";

const ListQuize = () => {
  const [quizList, setQuizList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuth();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token.access}`,
    },
  };

  const fetchQuizzes = async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      let url = `https://aasu.pythonanywhere.com/quize/list/?page=${page}`;
      if (search) {
        url = `https://aasu.pythonanywhere.com/quize/search/?search=${search}&page=${page}`;
      }
      const response = await axios.get(url, config);
      setQuizList(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Error fetching quiz list:", error);
      toast.error("Error fetching quiz list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(
        `https://aasu.pythonanywhere.com/quize/delete/${quizId}/`,
        config
      );
      setQuizList(quizList.filter((quiz) => quiz.id !== quizId));
      toast.success(`Quiz with ID ${quizId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting quiz with ID ${quizId}:`, error);
      toast.error(`Error deleting quiz with ID ${quizId}`);
    }
  };

  const handleSearch = debounce((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  }, 300);

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="container mx-auto">
      <div className="text-gray-700 sans-serif-text text-3xl ml-1 mt-4">
        Quiz List
      </div>
      <div className="flex justify-between items-center mb-4 -mt-1">
        <div className="flex justify-between items-center mb-4 mt-8">
          <div className="flex items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                placeholder="Search quizzes..."
                className="pl-10 p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <Link to="/addquiz">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Add Quiz
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-auto shadow mx-26 mt-8">
          <table className="w-full mb-0">
            <thead className="bg-gray-100 text-left border-b-2 border-gray-700">
              <tr>
                <th className="w-20 p-3 text-sm font-semibold">ID</th>
                <th className="w-64 p-3 text-sm font-semibold">Photo</th>
                <th className="w-64 p-3 text-sm font-semibold">Heading</th>
                <th className="w-64 p-3 text-sm font-semibold">Sub Heading</th>
                <th className="w-20 p-3 text-sm font-semibold">Price</th>
                <th className="w-32 p-3 text-sm font-semibold">
                  Time Duration
                </th>
                <th className="w-32 p-3 text-sm font-semibold">Created By</th>
                <th className="w-32 p-3 text-sm font-semibold">Active</th>
                <th className="w-32 p-3 text-sm font-semibold">
                  Number Of Questions
                </th>
                <th className="w-64 p-3 text-sm font-semibold">Tags</th>
                <th className="w-44 p-3 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quizList && quizList.length > 0 ? (
                quizList.map((quiz) => (
                  <tr
                    key={quiz.id}
                    className="bg-white border-r text-left border-b text-sm text-gray-600"
                  >
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {quiz.id}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <img
                        src={quiz.photo}
                        alt={`Quiz ${quiz.id}`}
                        className="h-10 w-12 rounded-lg"
                      />
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {quiz.heading}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {quiz.sub_heading}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {quiz.price}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {quiz.time_duration}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {quiz.created_by}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <button
                        className={`w-20 px-4 py-2 rounded-lg ${
                          quiz.active ? "bg-green-500" : "bg-red-500"
                        } text-white text-center`}
                      >
                        {quiz.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {quiz.total_question}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {quiz.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                        >
                          {tag.tage_name}
                        </span>
                      ))}
                    </td>
                    <td>
                      <Link to={`/updatequize/${quiz.id}`}>
                        <button className="bg-blue-900 text-white px-3 py-2 mr-4 rounded-lg hover:bg-purple-800 hover:text-green">
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="bg-red-800 text-white px-3 py-2 rounded-lg hover:bg-red-900 hover:text-red"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="p-3 text-lg text-gray-700 text-center"
                  >
                    No quizzes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-4">
        {currentPage > 1 && (
          <button
            className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-4 py-2 mx-1 rounded focus:outline-none ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ListQuize;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import { useAuth } from "../Hooks/UseAuth";
import { toast } from "react-toastify";

const ListQuize = () => {
  const [quizList, setQuizList] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get("https://exam.advicekoreanlearningcenter.com/quize/list/")
      .then((response) => {
        setQuizList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz list:", error);
      });
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token.access}`,
    },
  };

  // Save data to local storage
  const setToLocalStorage = (
    id,
    photo,
    heading,
    sub_heading,
    price,
    time_duration,
    created_by,
    tags
  ) => {
    localStorage.setItem("id", id);
    localStorage.setItem("photo", photo);
    localStorage.setItem("heading", heading);
    localStorage.setItem("sub_heading", sub_heading);
    localStorage.setItem("price", price);
    localStorage.setItem("time_duration", time_duration);
    localStorage.setItem("created_by", created_by);
    localStorage.setItem("tags", tags);
    // localStorage.setItem("tags", tags.join(','));
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      console.log(quizId);
      await axios.delete(
        `https://exam.advicekoreanlearningcenter.com/quize/delete/${quizId}/`,
        config
      );
      // Remove the deleted quiz from the quizList state
      setQuizList(quizList.filter((quiz) => quiz.id !== quizId));
      // console.log(`Quiz with ID ${quizId} deleted successfully.`);
      toast.success(`Quiz with ID ${quizId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting quiz with ID ${quizId}:`, error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4 mt-6">
        <div className="text-gray-700 sans-serif-text text-3xl ml-1">
          Quiz List
        </div>
        <div>
          <Link to="/addquiz">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Add Quize
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-auto shadow mx-26 mt-8">
        <table className="w-full mb-0">
          <thead className="bg-gray-100 text-left border-b-2 border-gray-700">
            <tr>
              <th className="w-20 p-3 text-sm font-semibold">ID</th>
              <th className="w-64 p-3 text-sm font-semibold">Photo</th>
              <th className="w-64 p-3 text-sm font-semibold">Heading</th>
              <th className="w-64 p-3 text-sm font-semibold">Sub Heading</th>
              <th className="w-20 p-3 text-sm font-semibold">Price</th>
              <th className="w-32 p-3 text-sm font-semibold">Time Duration</th>
              <th className="w-32 p-3 text-sm font-semibold">Created By</th>
              <th className="w-64 p-3 text-sm font-semibold">Tags</th>
              <th className="w-44 p-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quizList.map((quiz) => (
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
                  <Link to={"/updatequize"}>
                    <button
                      onClick={(e) =>
                        setToLocalStorage(
                          quiz.id,
                          quiz.photo,
                          quiz.heading,
                          quiz.sub_heading,
                          quiz.price,
                          quiz.time_duration,
                          quiz.created_by
                        )
                      }
                      className="bg-blue-900 text-white px-3 py-2 mr-4 rounded-lg hover:bg-purple-800 hover:text-green"
                    >
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListQuize;

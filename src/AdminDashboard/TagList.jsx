import React, { useState, useEffect } from "react";
import { useGET } from "../Hooks/useApi";
import axios from "axios";
import Loading from "../Components/Loading/Loading";
import { useAuth } from "../Hooks/UseAuth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const TagList = () => {
  const { user } = useAuth();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token.access}`,
    },
  };
  const { data, isLoading } = useGET(`tags/list/`, config);
  console.log(data);
  const [tagList, setTagList] = useState([]);

  const handleDeleteQuiz = async (tagid) => {
    try {
      console.log(tagid);
      await axios.delete(
        `https://aasu.pythonanywhere.com/tags/delete/${tagid}/`,
        config
      );
      // Remove the deleted quiz from the quizList state
      setTagList(tagList.filter((tag) => tag.id !== tagid));
      console.log(`Quiz with ID ${tagid} deleted successfully.`);
      toast.success(`Quiz with ID ${tagid} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting quiz with ID ${tagid}:`, error);
    }
  };

  useEffect(() => {
    if (!isLoading && data) {
      setTagList(data);
    }
  }, [isLoading, data]);
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4 mt-8">
        <div className="text-gray-700 sans-serif-text text-3xl ml-28">
          Tag List
        </div>
        <div>
          <Link to="/addtag">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300 mr-28">
              Add Tag
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-auto shadow mx-28 mt-8">
        <table className="w-full mb-0">
          <thead className="bg-gray-100 text-left border-b-2 border-gray-700">
            <tr>
              <th className="w-20 p-3 text-sm font-semibold">ID</th>
              <th className="w-64 p-3 text-sm font-semibold">Tag Name</th>
              <th className="w-64 p-3 text-sm font-semibold">Created By</th>
              <th className="w-64 p-3 text-sm font-semibold">Updated By</th>
              <th className="w-64 p-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tagList.map((tag) => (
              <tr
                key={tag.id}
                className="bg-white border-r text-left border-b text-sm text-gray-600"
              >
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {tag.id}
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {tag.tage_name}
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {tag.created_by}
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {tag.updated_by}
                </td>
                <td>
                  <Link to={""}>
                    <button
                      // onClick={(e) => setToLocalStorage(quiz.id, quiz.photo, quiz.heading, quiz.sub_heading, quiz.price, quiz.time_duration, quiz.created_by)}
                      className="bg-blue-900 text-white px-3 py-2 mr-4 rounded-lg hover:bg-purple-800 hover:text-green"
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteQuiz(tag.id)}
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
export default TagList;

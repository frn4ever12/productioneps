import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Components/Loading/Loading";
import { useAuth } from "../Hooks/UseAuth";
import { toast } from "react-toastify";

const UserList = () => {
  const [status, setStatus] = useState("all");
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token.access}`,
    },
  };

  const fetchData = async (status) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://exam.advicekoreanlearningcenter.com/users/${status}/`,
        config
      );
      setUserData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDeleteUser = async (userId) => {
    try {
      console.log(userId);
      await axios.delete(
        `https://exam.advicekoreanlearningcenter.com/user/delete/${userId}/`,
        config
      );
      // Remove the deleted quiz from the quizList state
      setUserData(userData.filter((user) => user.id !== userId));
      // console.log(`Quiz with ID ${quizId} deleted successfully.`);
      toast.success(`Quiz with ID ${userId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting quiz with ID ${userId}:`, error);
    }
  };

  useEffect(() => {
    fetchData(status);
  }, [status]);

  return (
    <div className="flex flex-col items-center mx-12 mt-10 mb-10">
      <div className="flex justify-between w-full mb-4">
        <div className="text-gray-700 sans-serif-text text-3xl">
          User's List
        </div>
        <div className="flex items-center">
          <label htmlFor="userType" className="mr-2">
            Type Of User:{" "}
          </label>
          <select
            id="userType"
            className="text-gray-600 bg-white border-2 border-gray-300 focus:border-blue-800 rounded-lg shadow-md py-2 px-8 appearance-none leading-tight focus:outline-none"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="all">All</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
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
                <th className="w-64 p-3 text-sm font-semibold">First Name</th>
                <th className="w-64 p-3 text-sm font-semibold">Last Name</th>
                <th className="w-20 p-3 text-sm font-semibold">Username</th>
                <th className="w-32 p-3 text-sm font-semibold">Phone</th>
                <th className="w-32 p-3 text-sm font-semibold">Exam ID</th>
                <th className="w-64 p-3 text-sm font-semibold">
                  Auth Provider
                </th>
                <th className="w-44 p-3 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userData.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-r text-left border-b text-sm text-gray-600"
                >
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {user.id}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <img
                      src={`https://exam.advicekoreanlearningcenter.com/${user.photo}`}
                      alt={`User ${user.id}`}
                      className="h-10 w-12 rounded-lg"
                    />
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {user.first_name}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {user.last_name}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {user.username}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {user.phone || "-"}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {user.exam_id || "-"}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {user.auth_provider}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
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
      )}
    </div>
  );
};

export default UserList;

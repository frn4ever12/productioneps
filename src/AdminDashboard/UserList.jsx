import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Components/Loading/Loading";
import { useAuth } from "../Hooks/UseAuth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const UserList = () => {
  const [status, setStatus] = useState("all");
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${user.token.access}`,
    },
  };

  const fetchData = async (status, page = 1, search = "") => {
    setIsLoading(true);
    try {
      let url = `https://aasu.pythonanywhere.com/users/${status}/?page=${page}`;
      if (search) {
        url = `https://aasu.pythonanywhere.com/user/search/?search=${search}&page=${page}`;
      }
      const response = await axios.get(url, config);
      setUserData(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setCurrentPage(1);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `https://aasu.pythonanywhere.com/user/delete/${userId}/`,
        config
      );
      setUserData(userData.filter((user) => user.id !== userId));
      toast.success(`User with ID ${userId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  useEffect(() => {
    fetchData(status, currentPage, searchTerm);
  }, [status, currentPage, searchTerm]);

  const totalPages = Math.ceil(totalCount / 10);
  const visiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  return (
    <>
      <div className="text-gray-700 sans-serif-text text-3xl mt-4 ml-12">
        User's List
      </div>
      <div className="flex flex-col items-center mx-12 mt-6 mb-10">
        <div className="flex justify-between w-full mb-4">
          <div className="flex items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
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
          <>
            <div className="overflow-auto shadow mx-26 mt-4">
              <table className="w-full mb-0">
                <thead className="bg-gray-100 text-left border-b-2 border-gray-700">
                  <tr>
                    <th className="w-20 p-3 text-sm font-semibold">ID</th>
                    <th className="w-64 p-3 text-sm font-semibold">Photo</th>
                    <th className="w-64 p-3 text-sm font-semibold">
                      First Name
                    </th>
                    <th className="w-64 p-3 text-sm font-semibold">
                      Last Name
                    </th>
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
                          src={`https://aasu.pythonanywhere.com/${user.photo}`}
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
                  {userData.length === 0 && !isLoading && (
                    <td
                      colSpan="10"
                      className="p-3 text-lg text-gray-700 text-center"
                    >
                      No User found
                    </td>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              {currentPage > 1 && (
                <button
                  className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              )}
              {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                <button
                  key={startPage + index}
                  className={`px-4 py-2 mx-1 rounded focus:outline-none ${
                    currentPage === startPage + index
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => handlePageChange(startPage + index)}
                >
                  {startPage + index}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserList;

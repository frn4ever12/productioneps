import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import { useAuth } from "../Hooks/UseAuth";
import Loading from "../Components/Loading/Loading";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const TagList = () => {
  const { user } = useAuth();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token.access}`,
    },
  };

  const [tagList, setTagList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTags = async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      let url = `https://aasu.pythonanywhere.com/tags/list/?page=${page}`;
      if (search) {
        url = `https://aasu.pythonanywhere.com/tags/search/?search=${search}&page=${page}`;
      }
      const response = await axios.get(url, config);
      setTagList(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Error fetching tags list:", error);
      toast.error("Error fetching tags list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(
        `https://aasu.pythonanywhere.com/tags/delete/${tagId}/`,
        config
      );
      setTagList(tagList.filter((tag) => tag.id !== tagId));
      toast.success(`Tag with ID ${tagId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting tag with ID ${tagId}:`, error);
      toast.error(`Error deleting tag with ID ${tagId}`);
    }
  };

  const handleSearch = debounce((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  }, 300);

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="container mx-auto">
      <div className="text-gray-700 sans-serif-text text-3xl ml-28 mt-6">
        Tag List
      </div>
      <div className="flex justify-between items-center mb-4 mt-8 ml-28 mr-28">
        <div className="flex items-center">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              type="text"
              placeholder="Search tags..."
              className="pl-10 p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Link to="/addtag">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Add Tag
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
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
              {tagList && tagList.length > 0 ? (
                tagList.map((tag) => (
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
                        <button className="bg-blue-900 text-white px-3 py-2 mr-4 rounded-lg hover:bg-purple-800 hover:text-green">
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
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
                    colSpan="5"
                    className="p-3 text-sm text-gray-700 text-center"
                  >
                    No tags found
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

export default TagList;

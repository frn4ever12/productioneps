import React, { useState, useEffect } from "react";
import Loading from "../Components/Loading/Loading";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Hooks/UseAuth";

const StudentResult = () => {
  const { user } = useAuth();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token.access}`,
    },
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://aasu.pythonanywhere.com/user/result/?page=${currentPage}`,
          config
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  if (isLoading) {
    return <Loading />;
  }

  const totalPages = Math.ceil(data?.count / 10) || 0;

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-2xl flex text-gray-700 font-bold text-center w-full mb-8">
        List of Results
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Percentage
              </th>
              {/* <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Result
              </th> */}
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.results.map((result) => (
              <tr key={result.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  {result.quize.map((currElem) => (
                    <p key={currElem.id} className="text-gray-700">
                      {currElem.heading}
                    </p>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-700">
                    {result.score.toFixed(2)}
                  </span>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`font-semibold ${
                      result.result === "pass"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {result.result}
                  </span>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Date(result.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NavLink to={`/resulttablestudent/${result.id}`}>
                    <span className="text-indigo-600 hover:text-indigo-900 font-medium">
                      View
                    </span>
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {currentPage > 1 && (
          <button
            className="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-800 focus:outline-none"
            onClick={handlePrevPage}
          >
            Previous
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-4 py-2 mx-1 rounded focus:outline-none ${
              currentPage === index + 1
                ? "bg-gray-500 text-white"
                : "bg-gray-500 text-white hover:bg-gray-800"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            className="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-800 focus:outline-none"
            onClick={handleNextPage}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentResult;

import React from "react";
import { useGET } from "../Hooks/useApi";
import Loading from "../Components/Loading/Loading";
import { NavLink } from "react-router-dom";

const StudentResult = () => {
  const { data, isLoading } = useGET("user/result/");
  console.log(data);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">List of Results</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Percentage
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Result
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((result) => (
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`font-semibold ${
                      result.result === "Pass"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {result.result}
                  </span>
                </td>
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
    </div>
  );
};

export default StudentResult;

// import React from "react";

// const StudentResult = () => {
//   return <div>StudentResult</div>;
// };

// export default StudentResult;

import React from "react";
import { useGET } from "../Hooks/useApi";
import Loading from "../Components/Loading/Loading";

const ResultTable = () => {
  const { data, isLoading } = useGET("user/result/");
  console.log(data);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="overflow-x-auto">
      <h2 className="text-[28px] ml-5 my-8">List of results</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Score
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Result
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((result) => (
            <tr key={result.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {result.quize.heading}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{result.score}</td>
              <td className="px-6 py-4 whitespace-nowrap">{result.result}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {result.created_at}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-indigo-600 hover:text-indigo-900">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;

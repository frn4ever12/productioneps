import React from "react";
import { useGET } from "../../Hooks/useApi";
import { useParams } from "react-router-dom";

const ResultTable = () => {
  const { id } = useParams();
  const { data, isLoading } = useGET(`indivisual/result/${id}/`);
  const { tabledata } = useGET(`indivisual/result/`);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Quiz Results</h2>

      {data.map((result, index) => (
        <div key={index}>
          <h3>Question {index + 1}</h3>
          <p>
            {/* Question ID:
            {result.quize.map((currElem) => (
              <p>{currElem}</p>
            ))} */}
          </p>
          <p>Correct Answer: {result.length}</p>
        </div>
      ))}
    </div>
  );
};

export default ResultTable;

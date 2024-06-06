import React from "react";
import { useGET } from "../../Hooks/useApi";
import { useParams } from "react-router-dom";

const ResultTable = () => {
  const { id } = useParams();
  const { data, isLoading } = useGET(`indivisual/result/${id}/`);
  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-600">
        Quiz Results
      </h2>
      {data?.result_data?.map((result, index) => (
        <div
          key={index}
          className={`mb-6 p-4 rounded-lg shadow-lg border ${
            result.selected_option === result.correct_answer
              ? "bg-green-100"
              : result.selected_option
              ? "bg-red-100"
              : "bg-white"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Question {index + 1}</h3>
          <div className="mb-4">
            <p>{result.question.questions}</p>
            {result.question.question_img && (
              <img
                src={`https://aasu.pythonanywhere.com${result.question.question_img}`}
                alt="Question"
                className="mt-2 w-full max-w-xs mx-auto"
              />
            )}
            {result.question.question_audio && (
              <audio
                controls
                className="mt-2 w-full"
                src={`https://aasu.pythonanywhere.com${result.question.question_audio}`}
              >
                Your browser does not support the audio element.
              </audio>
            )}
            {result.question.question_table && (
              <div
                className="mt-2 p-2 border border-gray-300 rounded"
                dangerouslySetInnerHTML={{
                  __html: result.question.question_table,
                }}
              />
            )}
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-medium">Options:</h4>
            <ol className="list-decimal list-inside">
              {result?.question?.answer?.map((answer, index) => (
                <React.Fragment key={index}>
                  {answer.option1 && <li className="mt-1">{answer.option1}</li>}
                  {answer.option2 && <li className="mt-1">{answer.option2}</li>}
                  {answer.option3 && <li className="mt-1">{answer.option3}</li>}
                  {answer.option4 && <li className="mt-1">{answer.option4}</li>}
                  {answer.option_image1 && (
                    <li className="mt-2">
                      <img
                        src={`https://aasu.pythonanywhere.com${answer.option_image1}`}
                        alt="Option 1"
                        className="w-full max-w-xs mx-auto"
                      />
                    </li>
                  )}
                  {answer.option_image2 && (
                    <li className="mt-2">
                      <img
                        src={`https://aasu.pythonanywhere.com${answer.option_image2}`}
                        alt="Option 2"
                        className="w-full max-w-xs mx-auto"
                      />
                    </li>
                  )}
                  {answer.option_image3 && (
                    <li className="mt-2">
                      <img
                        src={`https://aasu.pythonanywhere.com${answer.option_image3}`}
                        alt="Option 3"
                        className="w-full max-w-xs mx-auto"
                      />
                    </li>
                  )}
                  {answer.option_image4 && (
                    <li className="mt-2">
                      <img
                        src={`https://aasu.pythonanywhere.com${answer.option_image4}`}
                        alt="Option 4"
                        className="w-full max-w-xs mx-auto"
                      />
                    </li>
                  )}
                  {answer.option_audio1 && (
                    <li className="mt-2">
                      <audio
                        controls
                        className="w-full"
                        src={`https://aasu.pythonanywhere.com${answer.option_audio1}`}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </li>
                  )}
                  {answer.option_audio2 && (
                    <li className="mt-2">
                      <audio
                        controls
                        className="w-full"
                        src={`https://aasu.pythonanywhere.com${answer.option_audio2}`}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </li>
                  )}
                  {answer.option_audio3 && (
                    <li className="mt-2">
                      <audio
                        controls
                        className="w-full"
                        src={`https://aasu.pythonanywhere.com${answer.option_audio3}`}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </li>
                  )}
                  {answer.option_audio4 && (
                    <li className="mt-2">
                      <audio
                        controls
                        className="w-full"
                        src={`https://aasu.pythonanywhere.com${answer.option_audio4}`}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-medium">Correct Answer:</h4>
            <p>{result.correct_answer}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-medium">Your Answer:</h4>
            <p>{result.selected_option || "Not Answered"}</p>
          </div>
          <div>
            <h4 className="text-lg font-medium">Status:</h4>
            {result.unsolved ? (
              <span className="text-red-500 font-bold">Unsolved</span>
            ) : (
              <span className="text-green-500 font-bold">Solved</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultTable;

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
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Question</th>
              <th className="px-4 py-2 border-b">Options</th>
              <th className="px-4 py-2 border-b">Correct Answer</th>
              <th className="px-4 py-2 border-b">Your Answer</th>
              <th className="px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.result_data?.map((result, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">
                  {result.question.questions}
                </td>
                <td className="px-4 py-2 border-b">
                  <ul className="list-disc pl-5">
                    {result?.question?.answer?.map((answer, index) => (
                      <ol>
                        <li>{answer.option1}</li>
                        <li>{answer.option2}</li>
                        <li>{answer.option3}</li>
                        <li>{answer.option4}</li>
                        <li>
                          {answer.option_image1 && (
                            <div className="w-1/2 p-2">
                              <img
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_image1
                                }
                                alt="Option Image 1"
                                className="mt-2 h-40 w-auto"
                              />
                            </div>
                          )}
                        </li>
                        <li>
                          {answer.option_image2 && (
                            <div className="w-1/2 p-2">
                              <img
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_image2
                                }
                                alt="Option Image 2"
                                className="mt-2 h-40 w-auto"
                              />
                            </div>
                          )}
                        </li>

                        <li>
                          {answer.option_image3 && (
                            <div className="w-1/2 p-2">
                              <img
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_image3
                                }
                                alt="Option Image 3"
                                className="mt-2 h-40 w-auto"
                              />
                            </div>
                          )}
                        </li>
                        <li>
                          {answer.option_image4 && (
                            <div className="w-1/2 p-2">
                              <img
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_image4
                                }
                                alt="Option Image 4"
                                className="mt-2 h-40 w-auto"
                              />
                            </div>
                          )}
                        </li>

                        {/* Audio Part */}
                        <li>
                          {answer.option_audio1 && (
                            <div className="w-1/2 p-2">
                              <audio
                                controls
                                className="mt-2"
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_audio1
                                }
                              >
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                        </li>
                        <li>
                          {answer.option_audio2 && (
                            <div className="w-1/2 p-2">
                              <audio
                                controls
                                className="mt-2"
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_audio2
                                }
                              >
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                        </li>
                        <li>
                          {answer.option_audio3 && (
                            <div className="w-1/2 p-2">
                              <audio
                                controls
                                className="mt-2"
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_audio3
                                }
                              >
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                        </li>
                        <li>
                          {answer.option_audio4 && (
                            <div className="w-1/2 p-2">
                              <audio
                                controls
                                className="mt-2"
                                src={
                                  "https://aasu.pythonanywhere.com" +
                                  answer.option_audio4
                                }
                              >
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                        </li>
                      </ol>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border-b">{result.correct_answer}</td>
                <td className="px-4 py-2 border-b">
                  {result.selected_option || "Not Answered"}
                </td>
                <td className="px-4 py-2 border-b">
                  {result.unsolved ? (
                    <span className="text-red-500">Unsolved</span>
                  ) : (
                    <span className="text-green-500">Solved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;

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
    <div className="container mx-auto p-4 ">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-600">
        Quiz Results
      </h2>
      {data?.result_data?.map((result, index) => (
        <div
          key={index}
          className={`mb-6 p-4 rounded-lg shadow-lg border ${
            result.selected_option === result.correct_answer
              ? "bg-green-100"
              : // : result.selected_option
                // ? "bg-red-100"
                // : "bg-white"
                "bg-red-100"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Question {index + 1}</h3>
          <div className="mb-6 ml-4 font-semibold">
            <p>{result.question.questions}</p>
            <p>{result.question.sub_question}</p>
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

          <hr className="my-4 border-t border-gray-300" />

          <div className="mt-4">
            <h1 className="text-lg text-gray-700 font-bold mb-2">Answers:</h1>
          </div>
          <div className="mb-2 ml-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result?.question?.answer?.map((answer, index) => (
                <React.Fragment key={index}>
                  {/* text part */}
                  {answer.option1 && (
                    <div className="w-1/2 p-2">
                      <strong>1:</strong> {answer.option1}
                    </div>
                  )}
                  {answer.option2 && (
                    <div className="w-1/2 p-2">
                      <strong>2:</strong> {answer.option2}
                    </div>
                  )}
                  {answer.option3 && (
                    <div className="w-1/2 p-2">
                      <strong>3:</strong> {answer.option3}
                    </div>
                  )}
                  {answer.option4 && (
                    <div className="w-1/2 p-2">
                      <strong>4:</strong> {answer.option4}
                    </div>
                  )}

                  {/* image part */}
                  {answer.option_image1 && (
                    <div className="w-1/2 p-2">
                      <strong>1:</strong>
                      <img
                        src={
                          answer.option_image1.startsWith(
                            "https://aasu.pythonanywhere.com"
                          )
                            ? answer.option_image1
                            : "https://aasu.pythonanywhere.com" +
                              answer.option_image1
                        }
                        alt="Option Image 1"
                        className="w-full max-w-xs mx-auto"
                      />
                    </div>
                  )}
                  {answer.option_image2 && (
                    <div className="w-1/2 p-2">
                      <strong>2:</strong>
                      <img
                        src={
                          answer.option_image2.startsWith(
                            "https://aasu.pythonanywhere.com"
                          )
                            ? answer.option_image2
                            : "https://aasu.pythonanywhere.com" +
                              answer.option_image2
                        }
                        alt="Option Image 2"
                        className="w-full max-w-xs mx-auto"
                      />
                    </div>
                  )}
                  {answer.option_image3 && (
                    <div className="w-1/2 p-2">
                      <strong>3:</strong>
                      <img
                        src={
                          answer.option_image3.startsWith(
                            "https://aasu.pythonanywhere.com"
                          )
                            ? answer.option_image3
                            : "https://aasu.pythonanywhere.com" +
                              answer.option_image3
                        }
                        alt="Option Image 3"
                        className="w-full max-w-xs mx-auto"
                      />
                    </div>
                  )}
                  {answer.option_image4 && (
                    <div className="w-1/2 p-2">
                      <strong>4:</strong>
                      <img
                        src={
                          answer.option_image4.startsWith(
                            "https://aasu.pythonanywhere.com"
                          )
                            ? answer.option_image4
                            : "https://aasu.pythonanywhere.com" +
                              answer.option_image4
                        }
                        alt="Option Image 4"
                        className="w-full max-w-xs mx-auto"
                      />
                    </div>
                  )}

                  {/* audio part */}
                  {answer.option_audio1 && (
                    <div className="w-1/2 p-2">
                      <strong>1:</strong>
                      <audio
                        controls
                        className="mt-2"
                        src={
                          answer.option_audio1.startsWith(
                            "https://aasu.pythonanywhere.com"
                          )
                            ? answer.option_audio1
                            : "https://aasu.pythonanywhere.com" +
                              answer.option_audio1
                        }
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  {answer.option_audio2 && (
                    <div className="w-1/2 p-2">
                      <strong>2:</strong>
                      <audio
                        controls
                        className="mt-2"
                        src={
                          answer.option_audio2.startsWith(
                            "https://aasu.pythonanywhere.com"
                          )
                            ? answer.option_audio2
                            : "https://aasu.pythonanywhere.com" +
                              answer.option_audio2
                        }
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  {answer.option_audio3 && (
                    <div className="w-1/2 p-2">
                      <strong>3:</strong>
                      <audio
                        controls
                        className="mt-2"
                        src={
                          answer.option_audio3.startsWith(
                            "https://aasu.pythonanywhere.com"
                          )
                            ? answer.option_audio3
                            : "https://aasu.pythonanywhere.com" +
                              answer.option_audio3
                        }
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  {answer.option_audio4 && (
                    <div className="w-1/2 p-2">
                      <strong>4:</strong>
                      <audio
                        controls
                        className="mt-2"
                        src={
                          answer.option_audio4.startsWith(
                            "https://aasu.pythonanywhere.com"
                          )
                            ? answer.option_audio4
                            : "https://aasu.pythonanywhere.com" +
                              answer.option_audio4
                        }
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <h1 className="text-lg font-bold">Correct Answer:</h1>
            <strong className="ml-6 text-lg">
              {result.correct_answer &&
                result.correct_answer.charAt(result.correct_answer.length - 1)}
            </strong>
          </div>

          <div className="mt-2">
            <h1 className="text-lg font-bold">Your Answer:</h1>
            <p className="ml-6 text-lg">
              {result.selected_option
                ? result.selected_option.charAt(
                    result.selected_option.length - 1
                  )
                : "Not Answered"}
            </p>
          </div>

          <div className="mt-2">
            <h1 className="text-lg font-bold font-bold">Status:</h1>
            {result.unsolved ? (
              <span className="text-red-500 font-bold ml-6 text-lg ">
                Unsolved
              </span>
            ) : (
              <span className="text-green-500 font-bold ml-6 text-lg ">
                Solved
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultTable;

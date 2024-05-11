// import React, { useState, useEffect } from "react";
// import axios from "axios"; // Import Axios
// import { useGET } from "../Hooks/useApi";
// import { useParams } from "react-router-dom";
// import { useAuth } from "../Hooks/UseAuth";

// const ExamTable = () => {
//   const { user } = useAuth();
//   const { id } = useParams();
//   const { data, isLoading } = useGET(`question/list/${id}/`);

//   const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [questionModel, setQuestionModel] = useState(true);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);

//   useEffect(() => {
//     if (data) {
//       setTotalQuestions(data.length);
//     }
//   }, [data]);

//   const handleClick = (index) => {
//     setSelectedQuestionIndex(index);
//     setQuestionModel(false);
//   };

//   const goToPreviousQuestion = () => {
//     if (selectedQuestionIndex > 0) {
//       setSelectedQuestionIndex(selectedQuestionIndex - 1);
//     }
//   };

//   const goToNextQuestion = () => {
//     if (selectedQuestionIndex < totalQuestions - 1) {
//       setSelectedQuestionIndex(selectedQuestionIndex + 1);
//       // Call function to send answer when navigating to the next question
//       sendAnswerToAPI(data[selectedQuestionIndex].id, selectedAnswer);
//     }
//   };

//   const handleAnswerSelection = (answer) => {
//     setSelectedAnswer(answer);
//   };

//   // Function to send answer to API
//   const sendAnswerToAPI = (questionId, selectedOption) => {
//     const payload = {
//       quiz_id: id,
//       answers: [
//         {
//           question_id: questionId,
//           selected_option: selectedOption ? selectedOption.text : "None",
//         },
//       ],
//     };

//     axios
//       .post("https://aasu.pythonanywhere.com/answer/check1/next/", payload, {
//         headers: {
//           Authorization: `Bearer ${user.token.access}`,
//         },
//       })
//       .then((response) => {
//         console.log("Answer submitted successfully:", response.data);
//       })
//       .catch((error) => {
//         console.error("Error submitting answer:", error);
//       });
//   };

//   if (isLoading) {
//     return <div>Loading...</div>; // or any other loading indicator
//   }

//   if (!data || data.length === 0) {
//     return <div>No data available.</div>;
//   }

//   const selectedQuestion = data[selectedQuestionIndex];

//   return (
//     <div className="flex w-full h-full flex-col justify-center items-center">
//       <div className="mt-20 pb-full w-[60rem]  items-center p-6 border-2 border-solid border-black">
//         <div className="p-2 text-[19px] flex w-full justify-center items-center gap-[10%] bg-blue-400">
//           <p>Total number of questions: {totalQuestions}</p>
//           <p>Solved</p>
//           <p>Unsolved</p>
//           <p>Remaining time</p>
//         </div>
//         <div className="m-4 min-h-[10rem]">
//           {questionModel ? (
//             <table>
//               <thead>
//                 <tr className="mt-3">
//                   <th>Number of question</th>
//                 </tr>
//               </thead>
//               <tbody className="m-4 w-auto flex flex-wrap gap-[0.5rem] border-2 border-solid border-black">
//                 {data.map((question, index) => (
//                   <tr
//                     className="p-2"
//                     key={question.id}
//                     onClick={() => handleClick(index)}
//                   >
//                     <td className="flex p-1 items-center justify-center w-[5rem] cursor-pointer border-2 border-solid border-black">
//                       <div className="flex">{question.id}</div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div>
//               <div className="flex">
//                 <div className="flex h-[30vh] overflow-y-auto flex-1 flex-col gap-[1rem]">
//                   {/* <h2 className="flex text-[24px]">Selected Question:</h2> */}
//                   <p className="flex text-[22px]">
//                     {selectedQuestion.questions}
//                   </p>
//                   {selectedQuestion.question_audio !== null &&
//                     selectedQuestion.question_audio !== undefined &&
//                     selectedQuestion.question_audio !== 0 && (
//                       <audio controls>
//                         <source
//                           src={
//                             "https://aasu.pythonanywhere.com" +
//                             selectedQuestion.question_audio
//                           }
//                           type="audio/mpeg"
//                         />
//                       </audio>
//                     )}
//                   {selectedQuestion.question_img !== null &&
//                     selectedQuestion.question_img !== undefined &&
//                     selectedQuestion.question_img !== 0 && (
//                       <p className="  w-full  p-1 ">
//                         <img
//                           className="h-45"
//                           src={
//                             "https://aasu.pythonanywhere.com" +
//                             selectedQuestion.question_img
//                           }
//                           alt="hello"
//                         />
//                       </p>
//                     )}
//                 </div>
//                 <div className="w-full h-[30vh] overflow-y-auto flex-1 ">
//                   <div className="flex w-full items-center justify-center flex flex-col items-center justify-center gap-[1rem]">
//                     {selectedQuestion.answer.map((answer) => (
//                       <p className="flex-col w-full  gap-[1rem] p-6 text-[18px]">
//                         {/* text answer */}

//                         <label>
//                           {answer.option1 !== null &&
//                             answer.option1 !== undefined &&
//                             answer.option1 !== 0 && (
//                               <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                                 <input
//                                   type="radio"
//                                   id={`option-${answer.id}`}
//                                   name={`answer-${answer.id}`}
//                                 />
//                                 {answer.option1}
//                               </p>
//                             )}
//                         </label>

//                         <label>
//                           {answer.option2 !== null &&
//                             answer.option2 !== undefined &&
//                             answer.option2 !== 0 && (
//                               <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                                 <input
//                                   type="radio"
//                                   id={`option-${answer.id}`}
//                                   name={`answer-${answer.id}`}
//                                 />
//                                 {answer.option2}
//                               </p>
//                             )}
//                         </label>
//                         {answer.option3 !== null &&
//                           answer.option3 !== undefined &&
//                           answer.option3 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input type="radio" name="answer" />
//                               {answer.option3}
//                             </p>
//                           )}
//                         {answer.option4 !== null &&
//                           answer.option4 !== undefined &&
//                           answer.option4 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input
//                                 type="radio"
//                                 id={`option-${answer.id}`}
//                                 name={`answer-${answer.id}`}
//                               />
//                               {answer.option4}
//                             </p>
//                           )}
//                         {/* audio answer */}

//                         {answer.option_audio1 !== null &&
//                           answer.option_audio1 !== undefined &&
//                           answer.option_audio1 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input type="radio" name="answer" />
//                               <audio controls>
//                                 <source
//                                   src={
//                                     "https://aasu.pythonanywhere.com" +
//                                     answer.option_audio1
//                                   }
//                                   type="audio/mpeg"
//                                 />
//                               </audio>
//                             </p>
//                           )}

//                         {answer.option_audio2 !== null &&
//                           answer.option_audio2 !== undefined &&
//                           answer.option_audio2 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input type="radio" name="answer" />
//                               <audio controls>
//                                 <source
//                                   src={
//                                     "https://aasu.pythonanywhere.com" +
//                                     answer.option_audio2
//                                   }
//                                   type="audio/mpeg"
//                                 />
//                               </audio>
//                             </p>
//                           )}

//                         {answer.option_audio3 !== null &&
//                           answer.option_audio3 !== undefined &&
//                           answer.option_audio3 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input type="radio" name="answer" />
//                               <audio controls>
//                                 <source
//                                   className="h-2"
//                                   src={
//                                     "https://aasu.pythonanywhere.com" +
//                                     answer.option_audio3
//                                   }
//                                   type="audio/mpeg"
//                                 />
//                               </audio>
//                             </p>
//                           )}

//                         {answer.option_audio4 !== null &&
//                           answer.option_audio4 !== undefined &&
//                           answer.option_audio4 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input type="radio" name="answer" />
//                               <audio controls>
//                                 <source
//                                   src={
//                                     "https://aasu.pythonanywhere.com" +
//                                     answer.option_audio4
//                                   }
//                                   type="audio/mpeg"
//                                 />
//                               </audio>
//                             </p>
//                           )}

//                         {/* image */}
//                         {answer.option_imag1 !== null &&
//                           answer.option_imag1 !== undefined &&
//                           answer.option_imag1 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input type="radio" name="answer" />
//                               <img
//                                 className="h-40"
//                                 src={
//                                   "https://aasu.pythonanywhere.com" +
//                                   answer.option_imag1
//                                 }
//                                 alt="hello"
//                               />
//                             </p>
//                           )}
//                         {answer.option_imag2 !== null &&
//                           answer.option_imag2 !== undefined &&
//                           answer.option_imag2 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input type="radio" name="answer" />
//                               <img
//                                 className="h-40"
//                                 src={
//                                   "https://aasu.pythonanywhere.com" +
//                                   answer.option_imag2
//                                 }
//                                 alt="hello"
//                               />
//                             </p>
//                           )}
//                         {answer.option_imag3 !== null &&
//                           answer.option_imag3 !== undefined &&
//                           answer.option_imag3 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input type="radio" name="answer" />
//                               <img
//                                 className="h-40"
//                                 src={
//                                   "https://aasu.pythonanywhere.com" +
//                                   answer.option_imag3
//                                 }
//                                 alt="hello"
//                               />
//                             </p>
//                           )}
//                         {answer.option_imag4 !== null &&
//                           answer.option_imag4 !== undefined &&
//                           answer.option_imag4 !== 0 && (
//                             <p className="border-b hover:bg-gray-200 w-full border-gray-400 p-1 pl-8">
//                               <input type="radio" name="answer" />
//                               <img
//                                 className="h-40"
//                                 src={
//                                   "https://aasu.pythonanywhere.com" +
//                                   answer.option_imag4
//                                 }
//                                 alt="hello"
//                               />
//                             </p>
//                           )}
//                       </p>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-center items-center gap-[2%]">
//                 <button
//                   className="h-[2.3rem] w-[6.2rem] hover:bg-gray-200 border-2 border-solid border-gray-400 p-1 rounded-xl"
//                   onClick={goToPreviousQuestion}
//                 >
//                   Previous
//                 </button>
//                 <button
//                   className="h-[2.3rem] w-[6.2rem] hover:bg-gray-200 border-2 border-solid border-gray-400 p-1 rounded-xl"
//                   onClick={goToNextQuestion}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="flex items-center justify-center mt-6">
//           <div className="gap-[10%] flex flex-1/2 w-full justify-center items-center">
//             <p
//               className="bg-blue-400 p-2 rounded-xl hover:bg-blue-600"
//               onClick={() => setQuestionModel(true)}
//             >
//               Total Question
//             </p>
//           </div>
//           <div className="flex justify-end items-center flex-1/2 w-full">
//             <button className="flex flex-1/2 bg-blue-400 p-2 rounded-xl hover:bg-blue-600">
//               Submit Answer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExamTable;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../Hooks/UseAuth";

// function AddQuestion(headers = {}) {
//   const { user } = useAuth();
//   const [questionCount, setQuestionCount] = useState(1);
//   const [questions, setQuestions] = useState([]);
//   const [quizHeadings, setQuizHeadings] = useState([]);
//   const [selectedQuizId, setSelectedQuizId] = useState(null);

//   useEffect(() => {
//     const fetchQuizeHeadings = async () => {
//       try {
//         const response = await axios.get(
//           "https://aasu.pythonanywhere.com/quize/"
//         );
//         setQuizHeadings(response.data);
//         console.log("============================", quizHeadings);
//       } catch (error) {
//         console.error("Failed to fetch tag headings:", error);
//       }
//     };

//     fetchQuizeHeadings();
//   }, []);

//   const addQuestion = () => {
//     setQuestionCount(questionCount + 1);
//   };

//   const deleteQuestion = (index) => {
//     const newQuestions = questions.filter((_, i) => i !== index);
//     setQuestions(newQuestions);
//     setQuestionCount(questionCount - 1);
//   };

//   const handleInputChange = (e, index) => {
//     const { name, value } = e.target;
//     const newQuestions = [...questions];
//     newQuestions[index] = { ...newQuestions[index], [name]: value };
//     setQuestions(newQuestions);
//   };

//   const handleFileChange = (e, index) => {
//     const file = e.target.files[0];
//     const newQuestions = [...questions];
//     newQuestions[index] = {
//       ...newQuestions[index],
//       question_img: file,
//       imgPreview: URL.createObjectURL(file),
//     };
//     setQuestions(newQuestions);
//   };

//   const handleFileChange1 = (e, index) => {
//     const file = e.target.files[0];
//     const newQuestions = [...questions];
//     newQuestions[index] = {
//       ...newQuestions[index],
//       question_audio: file,
//       audioPreview: URL.createObjectURL(file),
//     };
//     setQuestions(newQuestions);
//   };

//   const handleQuizSelect = (e) => {
//     setSelectedQuizId(e.target.value); // Update selected quiz ID
//   };

//   const submitQuestions = async () => {
//     try {
//       await Promise.all(
//         questions.map(async (question) => {
//           const formData = new FormData();
//           // formData.append("quize", question.quize);
//           formData.append("quize", selectedQuizId);
//           formData.append("questions", question.questions);
//           formData.append("question_table", question.question_table);
//           // Append image and audio files if provided
//           if (question.question_img) {
//             formData.append("question_img", question.question_img);
//           }
//           if (question.question_audio) {
//             formData.append("question_audio", question.question_audio);
//           }

//           const response = await axios.post(
//             "https://aasu.pythonanywhere.com/question/create/",
//             formData,
//             {
//               headers: {
//                 ...headers,
//                 Authorization: `Bearer ${user.token.access}`,
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           console.log("Question added successfully:", response.data);
//           alert("Question added successfully:", response.data);
//         })
//       );
//     } catch (error) {
//       alert("Failed to add question:", error.response.data);
//       console.error("Failed to add question:", error.response.data);
//     }
//   };

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8">Add Question</h1>
//       <button
//         className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors duration-300"
//         onClick={addQuestion}
//       >
//         Add Question
//       </button>
//       <div className="space-y-8">
//         {[...Array(questionCount)].map((_, index) => (
//           <div key={index} className="border border-gray-300 p-6 rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">Question {index + 1}</h2>
//             <div className="space-y-4">
//               {/* <div className="flex items-center">
//                 <label className="mr-4 w-32">Quiz ID:</label>
//                 <input
//                   type="text"
//                   name="quize"
//                   value={questions[index]?.quize || ""}
//                   onChange={(e) => handleInputChange(e, index)}
//                   className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
//                 />
//               </div> */}
//               <div className="flex items-center">
//                 <label className="mr-4 w-32">Quiz:</label>
//                 <select
//                   value={selectedQuizId}
//                   onChange={handleQuizSelect}
//                   className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
//                 >
//                   <option value="" disabled>
//                     Select Quiz
//                   </option>
//                   {quizHeadings.map((quiz) => (
//                     <option key={quiz.id} value={quiz.id}>
//                       {quiz.heading}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-center">
//                 <label className="mr-4 w-32">Questions:</label>
//                 <input
//                   type="text"
//                   name="questions"
//                   value={questions[index]?.questions || ""}
//                   onChange={(e) => handleInputChange(e, index)}
//                   className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
//                 />
//               </div>
//               <div className="flex items-center">
//                 <label className="mr-4 w-32">Questions Table:</label>
//                 <input
//                   type="text"
//                   name="question_table"
//                   value={questions[index]?.question_table || ""}
//                   onChange={(e) => handleInputChange(e, index)}
//                   className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
//                 />
//               </div>
//               <div className="flex items-center">
//                 <label className="mr-4 w-32">Questions Image:</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   name="question_img"
//                   onChange={(e) => handleFileChange(e, index)}
//                   className="flex-1"
//                 />
//                 {questions[index]?.imgPreview && (
//                   <img
//                     src={questions[index].imgPreview}
//                     alt="Image Preview"
//                     className="w-40 h-30 ml-4 rounded-lg"
//                   />
//                 )}
//               </div>
//               <div className="flex items-center">
//                 <label className="mr-4 w-32">Questions Sound:</label>
//                 <input
//                   type="file"
//                   accept="audio/*"
//                   name="question_audio"
//                   onChange={(e) => handleFileChange1(e, index)}
//                   className="flex-1"
//                 />
//                 {questions[index]?.audioPreview && (
//                   <audio controls className="ml-4">
//                     <source
//                       src={questions[index].audioPreview}
//                       type="audio/mp3"
//                     />
//                     Your browser does not support the audio element.
//                   </audio>
//                 )}
//               </div>
//             </div>
//             <button
//               className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 mr-4 hover:bg-red-600 transition-colors duration-300"
//               onClick={() => deleteQuestion(index)}
//             >
//               Delete
//             </button>
//             {index === questionCount - 1 && (
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors duration-300"
//                 onClick={addQuestion}
//               >
//                 Add Question
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-8 hover:bg-blue-600 transition-colors duration-300"
//         onClick={submitQuestions}
//       >
//         Submit Questions
//       </button>
//     </div>
//   );
// }

// export default AddQuestion;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Hooks/UseAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddQuestion = ({ headers = {} }) => {
  const { user } = useAuth();
  const [questionCount, setQuestionCount] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [quizHeadings, setQuizHeadings] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [inputType, setInputType] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    option_image1: null,
    option_image2: null,
    option_image3: null,
    option_image4: null,
    option_audio1: null,
    option_audio2: null,
    option_audio3: null,
    option_audio4: null,
    correct_answer: "",
  });

  useEffect(() => {
    const fetchQuizHeadings = async () => {
      try {
        const response = await axios.get("https://aasu.pythonanywhere.com/quize/");
        setQuizHeadings(response.data);
      } catch (error) {
        console.error("Failed to fetch quiz headings:", error);
      }
    };

    fetchQuizHeadings();
  }, []);

  const addQuestion = () => {
    setQuestionCount(questionCount + 1);
  };

  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setQuestionCount(questionCount - 1);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [name]: value };
    setQuestions(newQuestions);
  };

  const handleFileChange = (name, file, index) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [name]: file };
    setQuestions(newQuestions);
  };

  const handleQuizSelect = (e) => {
    setSelectedQuizId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the latest question and answer
      const latestQuestion = questions[questions.length - 1];

      // Submit the latest question
      const formDataQuestion = new FormData();
      formDataQuestion.append("quize", selectedQuizId);
      formDataQuestion.append("questions", latestQuestion.questions);
      formDataQuestion.append("question_table", latestQuestion.question_table);
      if (latestQuestion.question_img) {
        formDataQuestion.append("question_img", latestQuestion.question_img);
      }
      if (latestQuestion.question_audio) {
        formDataQuestion.append("question_audio", latestQuestion.question_audio);
      }

      const responseQuestion = await axios.post(
        "https://aasu.pythonanywhere.com/question/create/",
        formDataQuestion,
        {
          headers: {
            ...headers,
            Authorization: `Bearer ${user.token.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Question added successfully:", responseQuestion.data);
      const questionId = responseQuestion.data.id;
      toast.success("Question added successfully");

      // Submit the latest answer
      const formDataAnswer = new FormData();
      formDataAnswer.append("question", questionId);

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (key.startsWith("option_image") || key.startsWith("option_audio")) {
            formDataAnswer.append(key, value, value.name);
          } else {
            formDataAnswer.append(key, value);
          }
        }
      });

      const responseAnswer = await axios.post(
        `https://aasu.pythonanywhere.com/answer/create/${questionId}/`,
        formDataAnswer,
        {
          headers: {
            Authorization: `Bearer ${user.token.access}`,
          },
        }
      );

      console.log("Answer added successfully:", responseAnswer.data);
      toast.success("Answer added successfully");

      // Increment question count and clear questions state
      addQuestion();
      setQuestions([]);

      // Reset the formData state to initial values
      setFormData({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        option_image1: null,
        option_image2: null,
        option_image3: null,
        option_image4: null,
        option_audio1: null,
        option_audio2: null,
        option_audio3: null,
        option_audio4: null,
        correct_answer: "",
      });

    } catch (error) {
      console.error("Failed to add question or answer:", error.response.data);
      toast.error("Failed to add question or answer");
    }
  };



  const handleQuestionChange = (e) => {
    setFormData({ ...formData, question: e.target.value });
  };

  const handleInputChangeAnswer = (e) => {
    setInputType(e.target.value);
  };

  const handleFileChangeAnswer = (name, file) => {
    const updatedFormData = {
      ...formData,
      [name]: file,
    };
    setFormData(updatedFormData);
  };

  const renderInputFields = () => {
    switch (inputType) {
      case "text":
        return Array.from({ length: 4 }).map((_, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={formData[`option${index + 1}`]}
            onChange={(e) =>
              setFormData({
                ...formData,
                [`option${index + 1}`]: e.target.value,
              })
            }
            className="p-2 border rounded-md"
          />
        ));
      case "audio":
        return Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <input
              key={index}
              type="file"
              onChange={(e) =>
                handleFileChangeAnswer(`option_audio${index + 1}`, e.target.files[0])
              }
              className="p-2 border rounded-md"
            />
            {formData[`option_audio${index + 1}`] && (
              <audio controls>
                <source
                  src={URL.createObjectURL(formData[`option_audio${index + 1}`])}
                  type="audio/mpeg"
                />
              </audio>
            )}
          </div>
        ));
      case "imag":
        return Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <input
              key={index}
              type="file"
              onChange={(e) =>
                handleFileChangeAnswer(`option_image${index + 1}`, e.target.files[0])
              }
              className="p-2 border rounded-md"
            />
            {formData[`option_image${index + 1}`] && (
              <img
                src={URL.createObjectURL(formData[`option_image${index + 1}`])}
                alt={`Option ${index + 1}`}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            )}
          </div>
        ));
      default:
        return null;
    }
  };

  const filteredDropdownOptions = Object.entries(formData)
    .filter(
      ([key, value]) =>
        key.startsWith("option") && value !== null && value !== ""
    )
    .map(([key]) => key);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add Question</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors duration-300"
        onClick={addQuestion}
      >
        Add Question
      </button>
      <div className="space-y-8">
        {[...Array(questionCount)].map((_, index) => (
          <div key={index} className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Question {index + 1}</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="mr-4 w-32">Quiz:</label>
                <select
                  value={selectedQuizId}
                  onChange={handleQuizSelect}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                >
                  <option value="" disabled>Select Quiz</option>
                  {quizHeadings.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>{quiz.heading}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="mr-4 w-32">Questions:</label>
                <input
                  type="text"
                  name="questions"
                  value={questions[index]?.questions || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Table:</label>
                <input
                  type="text"
                  name="question_table"
                  value={questions[index]?.question_table || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  name="question_img"
                  onChange={(e) => handleFileChange("question_img", e.target.files[0], index)}
                  className="flex-1"
                />
                {questions[index]?.question_img && (
                  <img
                    src={URL.createObjectURL(questions[index].question_img)}
                    alt="Question Image"
                    className="w-40 h-30 ml-4 rounded-lg"
                  />
                )}
              </div>
              <div className="flex items-center">
                <label className="mr-4 w-32">Questions Sound:</label>
                <input
                  type="file"
                  accept="audio/*"
                  name="question_audio"
                  onChange={(e) => handleFileChange("question_audio", e.target.files[0], index)}
                  className="flex-1"
                />
                {questions[index]?.question_audio && (
                  <audio controls className="ml-4">
                    <source
                      src={URL.createObjectURL(questions[index].question_audio)}
                      type="audio/mp3"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </div>
            <div>
              <hr className="my-6 border-gray-300 mx-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Answer</h2>
            </div>
            {/* AddAnswer form */}
            <form
              className="flex flex-col space-y-4 p-2 border rounded-md"
              onSubmit={handleSubmit}
            >
              <div className="-ml-2">
                <label>Select Input Type:</label>
                <select
                  className="p-2 border rounded-md"
                  value={inputType}
                  onChange={handleInputChangeAnswer}
                >
                  <option value="">Select Input Type</option>
                  <option value="text">Text</option>
                  <option value="audio">Audio</option>
                  <option value="imag">Image</option>
                </select>
              </div>
              {renderInputFields()}
              <div className="-ml-2">
                <label>Select Correct Option:</label>
                <select
                  className="p-2 border rounded-md"
                  value={formData.correct_answer}
                  onChange={(e) =>
                    setFormData({ ...formData, correct_answer: e.target.value })
                  }
                >
                  <option value="">Select Correct Option</option>
                  {filteredDropdownOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 mr-4 hover:bg-red-600 transition-colors duration-300"
              onClick={() => deleteQuestion(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-8 hover:bg-blue-600 transition-colors duration-300"
        onClick={handleSubmit}
      >
        {/* Submit Questions */}
        Add Question
      </button>
    </div>
  );
};

export default AddQuestion;


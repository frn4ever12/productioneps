import React from "react";
import { NavLink } from "react-router-dom";

const InstantResult = ({ scoreresult }) => {
  console.log(scoreresult);
  return (
    <div className="bg-gray-100 top-0 h-full w-full fixed flex justify-center items-center">
      <div className=" w-full h-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-[30px] font-bold text-center mb-6">
          Congratulation, Exam Ended
        </h1>
        <div className="border-b border-gray-300 pb-6 mb-6">
          <div className="flex justify-between">
            <p className="text-[26px] font-semibold">Name:</p>
            <p className="text-[26px]">{scoreresult.user.username}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-[26px] font-semibold">Exam ID:</p>
            <p className="text-[26px]">{scoreresult.exam.id}</p>
          </div>
        </div>
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="gap-[2rem] flex flex-col">
              <p className="text-[18px] border-b-2 font-semibold">
                Total Questions:
              </p>
              <p className="text-[18px] border-b-2 font-semibold">
                Correct answer
              </p>
              <p className="text-[18px] border-b-2 font-semibold">
                Solved Questions:
              </p>
              <p className="text-[18px] border-b-2 font-semibold">
                Unsolved Questions:
              </p>
              <p className="text-[18px] border-b-2 font-semibold">Result:</p>
              <p className="text-[18px] border-b-2 font-semibold">
                Percentage:
              </p>
            </div>
            <div className="gap-[2rem] flex flex-col">
              <p className="text-[18px] flex justify-end border-b-2 font-semibold">
                {scoreresult.total_questions}
              </p>
              <p className="text-[18px] flex justify-end border-b-2 font-semibold">
                {scoreresult.correct_answers}
              </p>
              <p className="text-[18px] flex justify-end border-b-2 font-semibold">
                {scoreresult.sloved}
              </p>
              <p className="text-[18px] flex justify-end border-b-2 font-semibold">
                {scoreresult.unsolved}
              </p>
              <p className="text-[18px] flex justify-end border-b-2 font-semibold">
                {scoreresult.user_result}
              </p>
              <p className="text-[18px] flex justify-end border-b-2 font-semibold">
                {scoreresult.score}%
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <NavLink to="/studentexamlist">
            <p className="bg-blue-200 p-3 rounded-xl">Back to Main Page</p>
          </NavLink>
          <button className="btn-blue">View Table</button>
          <button className="btn-blue">Result List</button>
        </div>
      </div>
    </div>
  );
};

export default InstantResult;

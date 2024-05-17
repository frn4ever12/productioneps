import React from "react";
import { useGET } from "../Hooks/useApi";
import Loading from "../Components/Loading/Loading";

const StudentProfile = () => {
  const { data, isLoading } = useGET("login/user/profile/");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex justify-center mt-4">
        <div className="text-gray-700 sans-serif-text text-3xl ml-1">
          {data.first_name}'s Profile
        </div>
      </div>
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg px-8 py-6 mb-8 mt-8">
        <div className="flex items-center justify-center mb-2">
          <div className="rounded-full h-32 w-32 flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-2xl">
            {data.first_name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className=" flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex justify-center mb-4">{`${data.first_name} ${data.last_name}`}</h2>
          <div className="mb-4">
            <hr></hr>
          </div>
          <p className="text-gray-700 text-lg">Email: {data.email}</p>
          <p className="text-gray-700 text-lg">Username: {data.username}</p>
          <p className="text-gray-700 text-lg">Phone: {data.phone}</p>
          <p className="text-gray-700 text-lg">Exam ID: {data.exam_id}</p>
          <p className="text-gray-700 text-lg">Role: Student</p>
          <p className="text-gray-700 text-lg">
            Joined on: {new Date(data.date_created).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

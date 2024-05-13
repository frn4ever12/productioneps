// import React from "react";

// const StudentProfile = () => {
//   return <div>StudentProfile</div>;
// };

// export default StudentProfile;

import React from "react";
import { useGET } from "../Hooks/useApi";
import Loading from "../Components/Loading/Loading";

const StudentProfile = () => {
  const { data, isLoading } = useGET("login/user/profile/");

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="flex items-center justify-center">
        <div className="rounded-full h-24 w-24 flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-xl">
          {data.first_name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-9">
        <h2 className="text-lg font-bold">{`${data.first_name} ${data.last_name}`}</h2>
        <p className="text-gray-700">Email: {data.email}</p>
        <p className="text-gray-700">Username: {data.username}</p>
        <p className="text-gray-700">Phone: {data.phone}</p>
        <p className="text-gray-700">Exam ID: {data.exam_id}</p>
        <p className="text-gray-700">
          Joined on: {new Date(data.date_created).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default StudentProfile;

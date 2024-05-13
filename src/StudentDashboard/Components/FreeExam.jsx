import React from "react";
import SingleCard from "./SingleCard";
import Loading from "../../Components/Loading/Loading";
import { useGET } from "../../Hooks/useApi";

const FreeExam = () => {
  const {
    data: questionlist,
    isLoading,
    refetch,
    setData: setquestionlist,
  } = useGET("quize/list/");

  if (isLoading) {
    return <Loading />;
  }
  //   console.log(questionlist);
  return (
    <div className="flex gap-[2rem] flex-wrap mb-[2rem] items-center justify-center ">
      {questionlist?.map((currElem, index) => {
        return <SingleCard key={currElem.id} {...currElem} />;
      })}
    </div>
  );
};

export default FreeExam;

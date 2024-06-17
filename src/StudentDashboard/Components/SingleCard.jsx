import React, { useState } from "react";
import img1 from "../../Image/qs.jpeg";
import Modal from "react-modal";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Hooks/UseAuth";
import { FaCircleUser } from "react-icons/fa6";

const SingleCard = (currElem) => {
  const { user } = useAuth();

  const {
    id,
    date_created,
    date_updated,
    created_by,
    updated_by,
    heading,
    photo,
    sub_heading,
    price,
    time_duration,
    tags,
  } = currElem;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="h-auto w-[19rem] pb-4 bg-white overflow-hidden rounded-[5px] hover:bg-black-200 shadow-md shadow-black-500 hover:shadow-lg">
        <div className="h-[9rem] w-auto bg-gray-400 overflow-hidden flex items-center justify-center">
          {photo && <img src={photo} className="h-full w-auto" alt="Photo" />}
          {!photo && <img src={img1} className="h-full w-auto" alt="" />}
        </div>
        <div className="flex flex-col gap-2 mt-2 ">
          <div className="ml-6 text-[25px] ">
            <h4>{heading}</h4>
          </div>
          <div className="ml-6 flex gap-[1rem]">
            {tags &&
              tags.map((tag, index) => (
                <p
                  key={index}
                  className="border-2 border-solid px-1 flex justify-center items-center rounded-[1rem]"
                >
                  {tag.tage_name}
                </p>
              ))}
          </div>

          <div className="flex gap-[10px] justify-center items-center">
            <p
              onClick={openModal}
              className="h-[2rem] w-[7rem] bg-gray-700 text-white rounded-xl  flex justify-center items-center hover:bg-gray-800"
            >
              Start Exam
            </p>
            {/* {price !== null && price !== undefined && price !== 0 && (
              <p
                onClick={openModal}
                className="h-[2rem] w-[7rem] bg-green-700 text-white rounded-xl  flex justify-center items-center hover:bg-green-900"
              >
                Esewa Payment
              </p>
            )} */}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal} // Close modal on request
        className="Modal flex flex-col items-center h-screen w-screen bg-white p-8 rounded shadow-md relative z-50 lg:top-1/2 lg:left-1/2 transform lg:-translate-x-1/2 lg:-translate-y-1/2"
        overlayClassName="Overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-90 z-40"
      >
        <div className="flex flex-col justify-center items-center border-2 mt-4  p-4 border-gray-300 text-[18px] w-full max-w-[70rem] rounded-lg">
          <h2 className="text-[30px] text-gray-800 font-bold mb-4">
            Exam Korean
          </h2>
          <p>
            <FaCircleUser className="text-[6rem]" />
          </p>
          <p>
            <span className="font-bold">Your Exam ID :</span>
            {user.user_exam_id}
          </p>
          <p>
            <span className="font-bold">Name of Student :</span>
            {user.user_name}
          </p>
          <p>
            <span className="font-bold">Exam Title : </span>
            {heading}
          </p>
          <p>
            <span className="font-bold">Exam Time : </span>
            {time_duration}
          </p>
          <NavLink to={`/examtable/${id}`}>
            <p className="bg-gray-700 hover:bg-gray-800 rounded-lg p-2 text-white mt-3 ">
              Get Started
            </p>
          </NavLink>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
        <div className="border-2 mt-4  p-4 border-gray-300 text-[18px] w-full max-w-[70rem] rounded-lg">
          <h2>Note</h2>
          <p>
            1. If internet disconnects during exam then exam is counted but
            result will not be saved
          </p>
          <p>
            2. You can give an answer or can leave it, It will be marked as not
            attempted
          </p>
        </div>
      </Modal>
    </>
  );
};

export default SingleCard;

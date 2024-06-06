import React, { useState } from "react";
import img1 from "../../Image/qs.jpeg";
import Modal from "react-modal";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Hooks/UseAuth";

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
      <div className="h-[14rem] w-[17rem] bg-white overflow-hidden rounded-[5px] hover:bg-black-200 shadow-md shadow-black-500 hover:shadow-lg">
        <div className="h-[6rem] w-auto bg-gray-600 overflow-hidden flex items-center justify-center">
          {photo && <img src={photo} className="h-full w-auto" alt="Photo" />}
          {!photo && <img src={img1} className="h-full w-auto" alt="" />}
        </div>
        <div className="flex flex-col gap-[1rem] mt-2 ">
          <div className="ml-6 ">
            <h4>{heading}</h4>
          </div>
          <div className="ml-6 flex gap-[1rem]">
            {tags &&
              tags.map((tag, index) => (
                <p
                  key={index}
                  className="border-2 border-solid p-1 flex justify-center items-center rounded-[1rem]"
                >
                  {tag.tage_name}
                </p>
              ))}
          </div>

          <div className="flex gap-[10px] justify-center items-center">
            <p
              onClick={openModal}
              className="h-[2rem] w-[7rem] bg-green-700 text-white rounded-xl  flex justify-center items-center hover:bg-green-900"
            >
              Start Exam
            </p>
            {price !== null && price !== undefined && price !== 0 && (
              <p
                onClick={openModal}
                className="h-[2rem] w-[7rem] bg-green-700 text-white rounded-xl  flex justify-center items-center hover:bg-green-900"
              >
                Esewa Payment
              </p>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal} // Close modal on request
        className="Modal w-auto bg-white p-4 rounded shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="Overlay fixed top-0 left-0 right-0 bottom-0 bg-black opacity-90"
      >
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-lg font-bold mb-4">Exam Korean</h2>
          <p>
            <span>Your Exam ID :</span>
            {user.user_exam_id}
          </p>
          <p>
            <span>Name of Student :</span>
            {user.user_name}
          </p>
          <p>
            <span>Exam Title : </span>
            {heading}
          </p>
          <p>
            <span>Exam Time : </span>
            {time_duration}
          </p>
          <NavLink to={`/examtable/${id}`}>
            <p className="bg-green-700 p-2 text-white mt-3 ">Get Started</p>
          </NavLink>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
        <div>
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

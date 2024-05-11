import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function ExamPopup({ isOpen, setIsOpen, score }) {
  const [isExamOpen, setIsExamOpen] = useState(false);
  const navigate = useNavigate();

  const toggleResultModal = () => {
    setIsExamOpen(!isExamOpen);
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const passThreshold = 70;
  const percentage = (score / 40) * 100;

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-auto text-center max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <>
                    <div className="confirmation-box bg-white border border-gray-300 rounded-lg shadow-md p-6 max-w-sm">
                      {/* <h2 className="text-xl font-bold mb-4">Confirm</h2>
                      <p className="text-gray-700 mb-4">
                        Are you sure you want to submit and end the exam?
                      </p>
                      <div className="flex justify-between">
                        <p
                          className="text-blue-500 cursor-pointer"
                          onClick={closeModal}
                        >
                          Cancel
                        </p>
                        <button
                          onClick={toggleResultModal}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        >
                          Agree
                        </button>
                      </div> */}
                      <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-sm mx-auto">
                        <h2 className="text-lg font-semibold mb-4">
                          Exam Result
                        </h2>
                        <p className="mb-2">
                          You scored {score} out of 40 questions.
                        </p>
                        <p className="mb-2">
                          Percentage: {percentage}%{" "}
                          {percentage >= passThreshold ? (
                            <span className="text-green-600 font-semibold">
                              PASS
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              FAIL
                            </span>
                          )}
                        </p>
                      </div>
                      <NavLink to="/studentexamlist">
                        <p className="mt-4 p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                          Back to main Page
                        </p>
                      </NavLink>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from "../Hooks/UseAuth";

// function UpdateQuiz() {
//     const navigate = useNavigate();
//     const [tags, setTags] = useState('');
//     const [created_by, setCreatedBy] = useState('');
//     const [time_duration, setTimeDuration] = useState('');
//     const [price, setPrice] = useState('');
//     const [sub_heading, setSubHeading] = useState('');
//     const [heading, setHeading] = useState('');
//     const [photo, setPhoto] = useState('');
//     const [id, setID] = useState(0);
//     const { user } = useAuth();
//     const [imagePreview, setImagePreview] = useState('');

//     // const handlephoto = (e) => {
//     //     const file = e.target.files[0];
//     //     setPhoto(file);
//     // };
//     // Function to handle image selection
//     const handlephoto = (e) => {
//         const file = e.target.files[0];
//         setPhoto(file);
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setImagePreview(reader.result);
//         };
//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     };
//     const handleheading = (e) => {
//         setHeading(e.target.value);
//     };
//     const handlesubheading = (e) => {
//         setSubHeading(e.target.value);
//     };
//     const handleprice = (e) => {
//         setPrice(e.target.value);
//     };
//     const handletime = (e) => {
//         setTimeDuration(e.target.value);
//     };
//     const handlecreated = (e) => {
//         setCreatedBy(e.target.value);
//     };
//     const handletag = (e) => {
//         setTags(e.target.value);
//     };

//     const config = {
//         headers: {
//             Authorization: `Bearer ${user.token.access}`,
//         }
//     };

//     const handleAPi = (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('photo', photo); // Append file here

//         // Append other fields
//         formData.append('heading', heading);
//         formData.append('sub_heading', sub_heading);
//         formData.append('price', price);
//         formData.append('time_duration', time_duration);
//         formData.append('created_by', created_by);
//         formData.append('tags', tags);
//         console.log(formData)

//         axios
//             .put(`https://aasu.pythonanywhere.com/quize/update/${id}/`, formData, config)
//             .then((result) => {
//                 console.log(result.data);
//                 toast.success(`Quiz updated successfully.`);
//                 navigate('/listquize', { replace: true });
//             })
//             .catch((error) => {
//                 console.log(error);
//                 toast.error('Failed to update quiz. Please try again.');
//             });
//     };

//     useEffect(() => {
//         setID(localStorage.getItem('id'));
//         // setPhoto(localStorage.getItem('photo'));
//         setHeading(localStorage.getItem('heading'));
//         setSubHeading(localStorage.getItem('sub_heading'));
//         setPrice(localStorage.getItem('price'));
//         setTimeDuration(localStorage.getItem('time_duration'));
//         setCreatedBy(localStorage.getItem('created_by'));
//         const storedTags = localStorage.getItem('tags');
//         setTags(storedTags ? storedTags.split(',') : []);

//         const storedPhoto = localStorage.getItem('photo');
//         if (storedPhoto) {
//             // Set the stored image as imagePreview
//             setImagePreview(storedPhoto);
//         }

//     }, []);
//     console.log(setTags)

//     return (
//         <div className="container mx-auto">
//             <form onSubmit={handleAPi} className="px-8 pt-6 pb-8 mb-4">
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Photo</label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         id='photo'
//                         type='file'
//                         name='photo'
//                         onChange={handlephoto}
//                         accept='image/*'
//                     />
//                     {imagePreview && (
//                         <img src={imagePreview} alt="Preview" className="mt-2 max-w-xs" />
//                     )}
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Heading</label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="text"
//                         value={heading}
//                         onChange={handleheading}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Sub Heading</label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="text"
//                         value={sub_heading}
//                         onChange={handlesubheading}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="text"
//                         value={price}
//                         onChange={handleprice}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Time Duration</label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="text"
//                         value={time_duration}
//                         onChange={handletime}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Created By</label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="text"
//                         readOnly
//                         value={created_by}
//                         onChange={handlecreated}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="text"
//                         value={tags}
//                         onChange={handletag}
//                         placeholder="Enter tags separated by comma"
//                     />
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <button
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         type="submit"
//                     >
//                         Update
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default UpdateQuiz;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from "../Hooks/UseAuth";
// import { Link } from "react-router-dom";

// function UpdateQuiz() {
//     const navigate = useNavigate();
//     const [tags, setTags] = useState('');
//     const [created_by, setCreatedBy] = useState('');
//     const [time_duration, setTimeDuration] = useState('');
//     const [price, setPrice] = useState('');
//     const [sub_heading, setSubHeading] = useState('');
//     const [heading, setHeading] = useState('');
//     const [photo, setPhoto] = useState('');
//     const [id, setID] = useState(0);
//     const { user } = useAuth();
//     const [imagePreview, setImagePreview] = useState('');

//     const handlephoto = (e) => {
//         const file = e.target.files[0];
//         setPhoto(file);
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setImagePreview(reader.result);
//         };
//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleheading = (e) => {
//         setHeading(e.target.value);
//     };

//     const handlesubheading = (e) => {
//         setSubHeading(e.target.value);
//     };

//     const handleprice = (e) => {
//         setPrice(e.target.value);
//     };

//     const handletime = (e) => {
//         setTimeDuration(e.target.value);
//     };

//     const handlecreated = (e) => {
//         setCreatedBy(e.target.value);
//     };

//     const handletag = (e) => {
//         setTags(e.target.value);
//     };

//     const config = {
//         headers: {
//             Authorization: `Bearer ${user.token.access}`,
//         }
//     };

//     const handleAPi = (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('photo', photo);

//         formData.append('heading', heading);
//         formData.append('sub_heading', sub_heading);
//         formData.append('price', price);
//         formData.append('time_duration', time_duration);
//         formData.append('created_by', created_by);
//         formData.append('tags', tags);

//         axios
//             .put(`https://aasu.pythonanywhere.com/quize/update/${id}/`, formData, config)
//             .then((result) => {
//                 toast.success(`Quiz updated successfully.`);
//                 navigate('/listquize', { replace: true });
//             })
//             .catch((error) => {
//                 toast.error('Failed to update quiz. Please try again.');
//             });
//     };

//     useEffect(() => {
//         setID(localStorage.getItem('id'));
//         setHeading(localStorage.getItem('heading'));
//         setSubHeading(localStorage.getItem('sub_heading'));
//         setPrice(localStorage.getItem('price'));
//         setTimeDuration(localStorage.getItem('time_duration'));
//         setCreatedBy(localStorage.getItem('created_by'));
//         const storedTags = localStorage.getItem('tags');
//         setTags(storedTags ? storedTags.split(',') : []);

//         const storedPhoto = localStorage.getItem('photo');
//         if (storedPhoto) {
//             setImagePreview(storedPhoto);
//         }

//     }, []);

//     return (
//         <div className="container mx-auto p-8">
//             <div className="flex justify-between items-center mb-6 mt-6">
//                 <div className="text-gray-700 sans-serif-text text-3xl ml-0">Quiz Update</div>
//                 <div>
//                     <Link to="/addquiz">
//                         <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
//                             Add Quize
//                         </button>
//                     </Link>
//                     <Link to="/listquize" className='ml-4'>
//                         <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
//                             Quize List
//                         </button>
//                     </Link>
//                 </div>
//             </div>
//             <form onSubmit={handleAPi} encType="multipart/form-data">
//                 <div className="grid grid-cols-2 gap-6">
//                     <div>
//                         <label className="block mb-2">Photo:</label>
//                         <input type="file" name="photo" onChange={handlephoto} />
//                         {imagePreview && (
//                             <img
//                                 src={imagePreview}
//                                 alt="Preview"
//                                 className="mt-4 rounded-lg"
//                                 style={{ maxWidth: "300px" }}
//                             />
//                         )}
//                     </div>
//                     <div>
//                         <label className="block mb-2">Heading:</label>
//                         <input
//                             type="text"
//                             name="heading"
//                             value={heading}
//                             onChange={handleheading}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2"
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-2">Sub Heading:</label>
//                         <input
//                             type="text"
//                             name="sub_heading"
//                             value={sub_heading}
//                             onChange={handlesubheading}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2"
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-2">Price:</label>
//                         <input
//                             type="text"
//                             name="price"
//                             value={price}
//                             onChange={handleprice}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2"
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-2">Tag:</label>
//                         <select
//                             name="tags"
//                             value={tags}
//                             onChange={handletag}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2"
//                         >
//                             <option value="">Select Tag</option>
//                             {/* Render options here */}
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block mb-2">Time Duration:</label>
//                         <input
//                             type="text"
//                             name="time_duration"
//                             value={time_duration}
//                             onChange={handletime}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2"
//                         />
//                     </div>
//                 </div>
//                 <div className="mt-8">
//                     <button
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
//                         type="submit"
//                     >
//                         Update Quiz
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default UpdateQuiz;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/UseAuth";
import { Link } from "react-router-dom";
import AddAnswer from "./AddAnswer";

function UpdateQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [created_by, setCreatedBy] = useState("");
  const [time_duration, setTimeDuration] = useState("");
  const [price, setPrice] = useState("");
  const [sub_heading, setSubHeading] = useState("");
  const [heading, setHeading] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setID] = useState(0);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    // Fetch tag list from the API
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          "https://exam.advicekoreanlearningcenter.com/tags/"
        );
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();

    setID(localStorage.getItem("id"));
    setHeading(localStorage.getItem("heading"));
    setSubHeading(localStorage.getItem("sub_heading"));
    setPrice(localStorage.getItem("price"));
    setTimeDuration(localStorage.getItem("time_duration"));
    setCreatedBy(localStorage.getItem("created_by"));
    const storedTags = localStorage.getItem("tags");
    setTags(storedTags ? storedTags.split(",") : []);
    // Log the value of tags from localStorage
    console.log("Tags stored in localStorage:", storedTags);

    const storedPhoto = localStorage.getItem("photo");
    if (storedPhoto) {
      setImagePreview(storedPhoto);
    }
  }, []);

  const handlephoto = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleheading = (e) => {
    setHeading(e.target.value);
  };

  const handlesubheading = (e) => {
    setSubHeading(e.target.value);
  };

  const handleprice = (e) => {
    setPrice(e.target.value);
  };

  const handletime = (e) => {
    setTimeDuration(e.target.value);
  };

  const handlecreated = (e) => {
    setCreatedBy(e.target.value);
  };

  const handleTagSelection = (e) => {
    const selectedTagId = e.target.value;
    const selectedTag = tags.find((tag) => tag.id === selectedTagId);
    if (selectedTag) {
      setSelectedTags([...selectedTags, selectedTag]);
    }
  };

  const handleAPi = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (photo) {
      formData.append("photo", photo);
    }

    formData.append("heading", heading);
    formData.append("sub_heading", sub_heading);
    formData.append("price", price);
    formData.append("time_duration", time_duration);
    formData.append("created_by", created_by);
    formData.append("tags", selectedTags.map((tag) => tag.id).join(","));

    try {
      const response = await axios.put(
        `https://exam.advicekoreanlearningcenter.com/quize/update/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(`Quiz updated successfully.`);
      navigate("/listquize", { replace: true });
    } catch (error) {
      toast.error("Failed to update quiz. Please try again.");
      console.error("Error updating quiz:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6 mt-6">
        <div className="text-gray-700 sans-serif-text text-3xl ml-0">
          Quiz Update
        </div>
        <div>
          <Link to="/addquiz">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Add Quize
            </button>
          </Link>
          <Link to="/listquize" className="ml-4">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none transition duration-300">
              Quize List
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleAPi} encType="multipart/form-data">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Photo:</label>
            <input type="file" name="photo" onChange={handlephoto} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 rounded-lg"
                style={{ maxWidth: "300px" }}
              />
            )}
          </div>
          <div>
            <label className="block mb-2">Heading:</label>
            <input
              type="text"
              name="heading"
              value={heading}
              onChange={handleheading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Sub Heading:</label>
            <input
              type="text"
              name="sub_heading"
              value={sub_heading}
              onChange={handlesubheading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Price:</label>
            <input
              type="text"
              name="price"
              value={price}
              onChange={handleprice}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Tags:</label>
            <select
              name="tags"
              onChange={handleTagSelection}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.tage_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Time Duration:</label>
            <input
              type="text"
              name="time_duration"
              value={time_duration}
              onChange={handletime}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
        <div className="mt-8">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            type="submit"
          >
            Update Quiz
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateQuiz;

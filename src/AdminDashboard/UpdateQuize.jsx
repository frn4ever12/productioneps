import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../Hooks/UseAuth";

function UpdateQuiz() {
    const navigate = useNavigate();
    const [tags, setTags] = useState('');
    const [created_by, setCreatedBy] = useState('');
    const [time_duration, setTimeDuration] = useState('');
    const [price, setPrice] = useState('');
    const [sub_heading, setSubHeading] = useState('');
    const [heading, setHeading] = useState('');
    const [photo, setPhoto] = useState('');
    const [id, setID] = useState(0);
    const { user } = useAuth();

    // const handlephoto = (e) => {
    //     setPhoto(e.target.value);
    // };
    const handlephoto = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
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
    const handletag = (e) => {
        setTags(e.target.value);
    };

    const config = {
        headers: {
            Authorization: `Bearer ${user.token.access}`,
        }
    };

    const handleAPi = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('photo', photo); // Append file here

        // Append other fields
        formData.append('heading', heading);
        formData.append('sub_heading', sub_heading);
        formData.append('price', price);
        formData.append('time_duration', time_duration);
        formData.append('created_by', created_by);
        formData.append('tags', tags);

        axios
            .put(`https://aasu.pythonanywhere.com/quize/update/${id}/`, formData, config)
            .then((result) => {
                console.log(result.data);
                toast.success(`Quiz updated successfully.`);
                navigate('/listquize', { replace: true });
            })
            .catch((error) => {
                console.log(error);
                toast.error('Failed to update quiz. Please try again.');
            });
    };

    useEffect(() => {
        setID(localStorage.getItem('id'));
        setPhoto(localStorage.getItem('photo'));
        setHeading(localStorage.getItem('heading'));
        setSubHeading(localStorage.getItem('sub_heading'));
        setPrice(localStorage.getItem('price'));
        setTimeDuration(localStorage.getItem('time_duration'));
        setCreatedBy(localStorage.getItem('created_by'));
        setTags(localStorage.getItem('tags'));

    }, []);

    return (
        <div className="container mx-auto">
            <form onSubmit={handleAPi} className="px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Photo</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id='photo'
                        type='file'
                        name='photo'
                        onChange={handlephoto}
                        accept='image/*'
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Heading</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={heading}
                        onChange={handleheading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Sub Heading</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={sub_heading}
                        onChange={handlesubheading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={price}
                        onChange={handleprice}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Time Duration</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={time_duration}
                        onChange={handletime}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Created By</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={created_by}
                        onChange={handlecreated}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={tags}
                        onChange={handletag}
                        placeholder="Enter tags separated by comma"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateQuiz;

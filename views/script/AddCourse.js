import React, { useState } from 'react';
import axios from 'axios';

const AddCourse = ({ onAddCourse }) => {
    const [course, setCourse] = useState({
        id: '',
        name: '',
        department: '',
        isOpen: true,
    });

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/courses', course);
            onAddCourse(response.data);
            setCourse({ id: '', name: '', department: '', isOpen: true });
            setError('');
        } catch (err) {
            setError('Failed to add course. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (course[name] !== value) {
            setCourse((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleCheckboxChange = () => {
        setCourse((prev) => ({
            ...prev,
            isOpen: !prev.isOpen,
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Course</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="name">Course Name:</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={course.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="department">Department:</label>
                <input
                    id="department"
                    type="text"
                    name="department"
                    value={course.department}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="isOpen">Open:</label>
                <input
                    id="isOpen"
                    type="checkbox"
                    name="isOpen"
                    checked={course.isOpen}
                    onChange={handleCheckboxChange}
                />
            </div>
            <button type="submit">Add Course</button>
        </form>
    );
};

export default AddCourse;
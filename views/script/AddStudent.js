import React, { useState } from 'react';
import axios from 'axios';

const AddStudent = ({ onAddStudent }) => {
    const [student, setStudent] = useState({
        id: '',
        name: '',
        department: '',
        semester: '',
        coursesEnrolled: [],
        completedCourses: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!/^\d+$/.test(student.semester)) {
            setError('Semester must be a numeric value.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/students', student);
            onAddStudent(response.data);
            setStudent({
                id: '',
                name: '',
                department: '',
                semester: '',
                coursesEnrolled: [],
                completedCourses: []
            });
        } catch (err) {
            setError('Failed to add student. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (student[name] !== value) {
            setStudent((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Add New Student</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={student.name}
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
                        value={student.department}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="semester">Semester:</label>
                    <input
                        id="semester"
                        type="text"
                        name="semester"
                        value={student.semester}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding Student...' : 'Add Student'}
                </button>
            </form>

            <h3>Entered Student Information:</h3>
            <div>
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Semester:</strong> {student.semester}</p>
            </div>
        </div>
    );
};

export default AddStudent;

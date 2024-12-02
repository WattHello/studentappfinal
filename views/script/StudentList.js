import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = ({ studentId }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/students/${studentId}`);
                setStudent(response.data);
            } catch (err) {
                setError('Failed to fetch student details. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [studentId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    if (!student) return <div>No student data available.</div>;

    return (
        <div>
            <h2>Student Details for {student?.student?.name}</h2>
            <p><strong>Department:</strong> {student?.student?.department}</p>
            <p><strong>Semester:</strong> {student?.student?.semester}</p>

            <h3>Completed Courses</h3>
            {student?.student?.completedCourses?.length > 0 ? (
                <ul>
                    {student.student.completedCourses.map((course) => (
                        <li key={course.courseId}>
                            {course.courseId} - Grade: {course.grade}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No completed courses available.</p>
            )}

            <h3>Average Grade: {student?.avgGrade !== undefined ? student.avgGrade : 'N/A'}</h3>
        </div>
    );
};

export default StudentList;
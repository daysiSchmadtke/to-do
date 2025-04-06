'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation'; // Adjust based on your routing system
import { getSingleTask, updateTask } from '../../../../api/tasksData'; // Adjust the path as necessary
import TaskForm from '../../../../components/TaskForm'; // Adjust the path as necessary

export default function EditTaskPage({ params }) {
  const [editItem, setEditItem] = useState({}); // Holds the task data for editing
  const [isLoading, setIsLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const { firebaseKey } = params; // Dynamic route parameter
  const router = useRouter(); // Use Next.js router for navigation

  // Function to close the edit page
  const closeEditPage = () => {
    router.push('/tasks'); // Navigate to a different page, e.g., the tasks list page
  };

  const handleSubmit = async (updatedTask) => {
    try {
      await updateTask(firebaseKey, updatedTask); // Update task in Firebase
      alert('Task updated successfully!'); // Notify the user about success
      closeEditPage(); // Call function to close the page
    } catch (err) {
      setError('Failed to update the task.'); // Set error message
      console.error(err); // Log the error
    }
  };

  useEffect(() => {
    if (firebaseKey) {
      getSingleTask(firebaseKey)
        .then((data) => {
          setEditItem(data); // Set the retrieved task data
          setIsLoading(false); // Stop loading once the data is retrieved
        })
        .catch((err) => {
          setError('Failed to load task data.'); // Handle errors in fetching task
          setIsLoading(false); // Stop loading
          console.error(err); // Log the error for debugging
        });
    }
  }, [firebaseKey]);

  if (isLoading) return <p>Loading...</p>; // Display loading state
  if (error) return <p>{error}</p>; // Display error message if any

  return <TaskForm obj={editItem} onSubmit={handleSubmit} />; // Pass data to TaskForm
}

EditTaskPage.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};

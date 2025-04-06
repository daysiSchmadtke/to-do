'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getTasks } from '../api/tasksData';
import AddTask from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

function Home() {
  const { user } = useAuth(); // Authenticated user data
  const [tasks, setTasks] = useState([]); // Holds the task list
  const [isAddingTask, setIsAddingTask] = useState(false); // Flag to toggle the task form

  // Fetch all tasks for the authenticated user
  const getAllTheTasks = () => {
    getTasks(user.uid).then((fetchedTasks) => setTasks(fetchedTasks));
  };

  useEffect(() => {
    getAllTheTasks(); // Load tasks on component mount
  }, []);

  // Toggle the task form visibility
  const toggleTaskForm = () => {
    setIsAddingTask((prevState) => !prevState);
  };

  // Navigate back to Home page after task update
  const handleTaskUpdate = () => {
    getAllTheTasks(); // Refresh task list
    setIsAddingTask(false); // Close the form
  };

  return (
    <div className="text-center d-flex flex-column justify-content-center align-content-center">
      <h1 style={{ marginBottom: '20px', marginTop: '20px' }}>Hello, {user.displayName}!</h1>

      {/* Toggle Task Form */}
      <Button
        variant="info"
        type="button"
        style={{
          marginBottom: '30px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        onClick={toggleTaskForm} // Toggle the flag
      >
        {isAddingTask ? 'Close Task Form' : 'New Task'}
      </Button>

      {/* Conditionally Render AddTask */}
      {isAddingTask && (
        <AddTask
          onUpdate={handleTaskUpdate} // Refresh tasks and close form on update
          closeForm={() => setIsAddingTask(false)}
        />
      )}

      {/* Task List */}
      <ul className="d-flex flex-wrap justify-content-center">
        {tasks.map((task) => (
          <TaskCard key={task.firebaseKey} taskObj={task} onUpdate={getAllTheTasks} />
        ))}
      </ul>
    </div>
  );
}

export default Home;

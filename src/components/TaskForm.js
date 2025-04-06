'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation'; // Router for navigation
import { createTask, updateTask } from '../api/tasksData';
import { useAuth } from '../utils/context/authContext';

const initialState = {
  description: '',
  name: '',
  complete: false,
};

function AddTask({ obj = initialState, onUpdate }) {
  const [formInput, setFormInput] = useState(obj); // Initialize formInput with obj or default
  const { user } = useAuth(); // Get user data
  const router = useRouter(); // Router for navigation

  // Update formInput whenever obj changes
  useEffect(() => {
    setFormInput(obj);
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      if (obj?.firebaseKey) {
        // Update existing task
        await updateTask(obj.firebaseKey, formInput);
      } else {
        // Create new task
        await createTask({ ...formInput, uid: user.uid }); // Add user ID to the new task
      }
      onUpdate(); // Refresh task list in parent component
      router.push('/'); // Redirect back to the home page
    } catch (error) {
      console.error('Error saving task:', error); // Log any errors
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{
        margin: '20px auto', // Center form horizontally
        width: '50%', // Set consistent width
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center contents vertically
        alignItems: 'center',
        minHeight: '30vh', // Adjust vertical alignment space
      }}
      className="text-black"
    >
      <h2 className="text-primary mt-5">{obj.firebaseKey ? 'Update' : 'Create'} Task</h2>

      {/* Task Name Input */}
      <FloatingLabel controlId="floatingInput1" label="Task Name" className="mb-3" style={{ width: '100%' }}>
        <Form.Control type="text" placeholder="Enter a Task" name="name" value={formInput.name} onChange={handleChange} required />
      </FloatingLabel>

      {/* Description Textarea */}
      <FloatingLabel controlId="floatingTextarea" label="Description" className="mb-3" style={{ width: '100%' }}>
        <Form.Control as="textarea" placeholder="Task Description" style={{ height: '100px' }} name="description" value={formInput.description} onChange={handleChange} required />
      </FloatingLabel>

      {/* Complete Status Toggle */}
      <Form.Check
        className="text-white mb-3"
        type="switch"
        id="complete"
        name="complete"
        label="Complete?"
        checked={formInput.complete}
        onChange={(e) => {
          setFormInput((prevState) => ({
            ...prevState,
            complete: e.target.checked,
          }));
        }}
      />

      {/* Submit Button */}
      <Button type="submit" className="btn-info me-3 mt-2">
        {obj.firebaseKey ? 'Update' : 'Create'} Task
      </Button>
    </Form>
  );
}

AddTask.propTypes = {
  obj: PropTypes.shape({
    description: PropTypes.string,
    complete: PropTypes.bool,
    name: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired, // Ensure onUpdate is required
};

export default AddTask;

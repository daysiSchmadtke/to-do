'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteTask } from '../api/tasksData';

function TaskCard({ taskObj, onUpdate }) {
  // Delete task and refresh the view
  const deleteThisTask = () => {
    if (window.confirm(`Delete ${taskObj?.name || 'Unnamed Task'}?`)) {
      deleteTask(taskObj?.firebaseKey)
        .then(() => onUpdate())
        .catch((error) => console.error('Error deleting task:', error)); // Handle errors
    }
  };

  return (
    <Card style={{ width: '20rem', margin: '30px', backgroundColor: '#F8F9FA' }}>
      <Card.Body>
        <Card.Title>{taskObj?.name || 'Unnamed Task'}</Card.Title> {/* Safe access */}
        <Card.Text>
          <strong>Description:</strong> {taskObj?.description || 'No description available'}
        </Card.Text>
        <Card.Text>
          <strong>Status:</strong> {taskObj?.complete ? 'Complete' : 'Incomplete'}
        </Card.Text>
        {/* Link to view details */}
        <Link href={`/tasks/${taskObj?.firebaseKey}`} passHref>
          <Button variant="primary" className="m-2">
            VIEW
          </Button>
        </Link>
        {/* Link to edit details */}
        <Link href={`/tasks/edit/${taskObj?.firebaseKey}`} passHref>
          <Button variant="info" className="m-2">
            EDIT
          </Button>
        </Link>
        {/* Delete button */}
        <Button variant="danger" onClick={deleteThisTask} className="m-2">
          DELETE
        </Button>
      </Card.Body>
    </Card>
  );
}

TaskCard.propTypes = {
  taskObj: PropTypes.shape({
    name: PropTypes.string.isRequired, // Task name
    description: PropTypes.string, // Task description (optional)
    complete: PropTypes.bool, // Task completion status
    firebaseKey: PropTypes.string.isRequired, // Unique Firebase key
  }).isRequired, // Ensure taskObj is passed
  onUpdate: PropTypes.func.isRequired, // Function to refresh tasks
};

export default TaskCard;

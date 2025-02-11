// index.js
import React, { useState, useEffect } from 'react'
const URL = process.env.REACT_APP_URL

const Landing = () => {
  // State variables for storing projects, new project title and etc,
  const [projects, setProjects] = useState([])
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectStatus, setNewProjectStatus] = useState('')
  const [newProjectCreatedOn, setNewProjectCreatedOn] = useState('')
  const [newProjectDeadline, setNewProjectDeadline] = useState('')
  const [newFinishedOn, setNewFinishedOn] = useState('')
  // editing project id
  const [editingProjectId, setEditingProjectId] = useState(null)
  // Update project title and etc
  const [updatedProjectTitle, setUpdatedProjectTitle] = useState('')
  const [updatedProjectStatus, setUpdatedProjectStatus] = useState('')
  const [updatedProjectCreatedOn, setUpdatedProjectCreatedOn] = useState('')
  const [updatedProjectDeadline, setUpdatedProjectDeadline] = useState('')
  const [updateFinishedOn, setUpdateFinishedOn] = useState('')

  //Use useEffect to get projects data from the server
  useEffect(() => {
    const getProjects = async () => {
      const response = await fetch(`${URL}/projects`)
      const data = await response.json()
      setProjects(data)
    }
    getProjects()
  }, [])

  // Function to add a new project

  const handleAddproject = async (e) => {
    e.preventDefault()
    const dateStamp = Date.now()
    console.log(new Date(dateStamp).toString())
    const sendingData = {
      project: newProjectTitle,
      username: 'username',
      status: newProjectStatus,
      created_on: '',
      deadline: newProjectDeadline,
      finished_on: newFinishedOn
    }
    console.log(sendingData)

    try {
      const response = await fetch(`${URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendingData)
      })

      const data = await response.json()
      setProjects([...projects, data])
      setNewProjectTitle('')
      setNewProjectStatus('')
      setNewProjectCreatedOn('')
      setNewProjectDeadline('')
      setNewFinishedOn('')
    } catch (error) {
      console.error('Error adding project:', error)
    }
  }

  // Function to delete a project
  const handleDelete = async id => {
    try {
      await fetch(`${URL}/projects/${id}`, {
        method: 'DELETE'
      })
      setProjects(projects.filter(project => project._id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  // Function to set up editing of a project
  const handleEdit = id => {
    const projectToEdit = projects.find(project => project._id === id)
    setEditingProjectId(id)
    setUpdatedProjectTitle(projectToEdit.project)
    setUpdatedProjectStatus(projectToEdit.status)
    setUpdatedProjectCreatedOn(projectToEdit.createdOn)
    setUpdatedProjectDeadline(projectToEdit.deadline)
    setUpdateFinishedOn(projectToEdit.finishedOn)
  }

  // Function to update a project
  const handleUpdate = async id => {
    try {
      await fetch(`${URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project: updatedProjectTitle,
          status: updatedProjectStatus,
          createdOn: updatedProjectCreatedOn,
          deadline: updatedProjectDeadline,
          finishedOn: updateFinishedOn
        })
      })
      setProjects(
        projects.map(project => {
          if (project._id === id) {
            return {
              ...project,
              project: updatedProjectTitle,
              status: updatedProjectStatus,
              createdOn: updatedProjectCreatedOn,
              deadline: updatedProjectDeadline,
              finishedOn: updateFinishedOn
            }
          }
          return project
        })
      )
      setEditingProjectId(null)
      updatedProjectTitle('')
      updatedProjectStatus('')
      updatedProjectCreatedOn('')
      updatedProjectDeadline('')
      updateFinishedOn('')
    } catch (error) {
      console.error('Error updating projects:', error)
    }
  }
  console.log(projects)

  if (projects.isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <div className="new-project-container">
        <div className="new-project-label">New project name:</div>
        {/*added */}
        <form className="new-project-form" onSubmit={handleAddproject}>
          <input
            className="project-name"
            type="text"
            name="project"
            value={newProjectTitle}
            onChange={v => setNewProjectTitle(v.target.value)}
            placeholder=""
          />

          <input
            style={{ display: 'none' }}
            type="text"
            name="status"
            value={newProjectStatus}
            onChange={v => setNewProjectStatus(v.target.value)}
          />

          <div className="new-project-label">deadline:</div>
          <input
            className="project-deadline"
            type="date"
            name="deadline"
            value={newProjectDeadline}
            onChange={v => setNewProjectDeadline(v.target.value)}
            placeholder="Project deadline"
          />

          {/* <input
          type="text"
          name="finishedOn"
          value={newFinishedOn}
          onChange={v => setNewFinishedOn(v.target.value)}
          placeholder="Project finished date"
        /> */}

          <input type="submit" value={'Create New Project'} />
        </form>
      </div>

      {/*end added */}

      {/* Display the list of projects */}
      {/* <h3>Projects</h3> */}

      <div className="project-card-list">
        {projects
          .slice(0)
          .reverse()
          .map(project => (
            <div key={project._id} className="project-card">
              {/* Check if project is being edited */}
              {editingProjectId === project._id ? (
                // If editing, display input fields
                <div className="project-card-title">
                  <input
                    className="project-button"
                    type="text"
                    value={updatedProjectTitle}
                    onChange={v => setUpdatedProjectTitle(v.target.value)}
                  />
                  {/* <input type='text' value={updatedProjectStatus} onChange={(v) => setUpdatedProjectStatus(v.target.value)}/> */}
                  {/* <input type='text' value={updatedProjectCreatedOn} onChange={(v) => setUpdatedProjectCreatedOn(v.target.value)}/> */}
                  <input
                    type="date"
                    value={updatedProjectDeadline}
                    onChange={v => setUpdatedProjectDeadline(v.target.value)}
                  />

                  {/* <input type='text' value={updateFinishedOn} onChange={(v) => setUpdateFinishedOn(v.target.value)}/> */}

                  <button onClick={() => handleUpdate(project._id)}>Save</button>
                </div>
              ) : (
                // If not editing, display project  as button, and edit and delete buttons
                <div className="project-card-title">
                  <a href={`/projects/${project._id}`} className="project-button">
                    {project.project}
                  </a>
                  <div className="project-actions">
                    <button onClick={() => handleEdit(project._id)}>
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button onClick={() => handleDelete(project._id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

export default Landing
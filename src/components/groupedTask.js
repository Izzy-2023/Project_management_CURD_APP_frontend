import React from 'react'
import { Link } from 'react-router-dom'

function GroupedTask({ tasks, heading }) {
  function priorityNumberToString(priority) {
    if (priority === '1') {
      return ['High', 'red']
    } else if (priority === '2') {
      return ['Medium', 'yellow']
    } else {
      return ['Low', 'green']
    }
  }

  tasks.sort((a, b) => a.priority - b.priority)

  return (
    <div className="subtasks flex border-corner">
      <h2 className="status-heading">{heading}</h2>

      {tasks.length > 0 ? (
        tasks.map(projectTask => {
          const [priorityLabel, priorityColor] = priorityNumberToString(projectTask.priority)
          const created_on = projectTask.created_on
          const className = `priority ${priorityColor}`
          return (
            <div key={projectTask._id} className="task-card border-corner">
              <Link to={`/projects/tasks/${projectTask._id}`} className="task-details">
                <div className="task-left-section">
                  <div className={className}>{priorityLabel}</div>
                </div>
                <div className="task-right-section">
                  <h2>{projectTask.task}</h2>
                  <div className="due-date">
                    <b>Due on:</b> {created_on}
                  </div>
                </div>
              </Link>
            </div>
          )
        })
      ) : (
        <div>No tasks for this project</div>
      )}
    </div>
  )
}

export default GroupedTask

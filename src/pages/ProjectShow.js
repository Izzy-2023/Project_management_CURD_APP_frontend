// frontend/src/pages/ProjectShow.js
import { useLoaderData, Form, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GroupedTask from "../components/groupedTask";
import { projectLoader } from "../loaders";

function ProjectShow() {
    const [projectTasks, setProjectTasks] = useState(useLoaderData());
    console.log(projectTasks);
    const params = useParams(); // gives {id: '<id>'}
    const [addTasks, setAddTasks] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false); // for adding new task
    
    const URL = process.env.REACT_APP_URL;

    useEffect(() => {
        const fetchProjectTasks = async () => {        
            const data = await projectLoader({ params: params });
            setProjectTasks(data);
            setAddTasks(false);
        };
        if (addTasks) {
            fetchProjectTasks().catch(console.error);
        }
    }, [addTasks, params]);

    async function handleNewTask(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const createdTask = {
            task: formData.get('task'),
            priority: formData.get('priority'),
            status: formData.get('status'),
            projectId: projectTasks?.[0]?.projectId || "",
            project: projectTasks?.[0]?.project || "",
        };
        
        try {
            await fetch(`${URL}/projects/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createdTask)
            });

            event.target.reset();
            setAddTasks(true);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    const todoTasks = projectTasks?.filter((item) => item.status === 'toDo');
    const inProgressTasks = projectTasks?.filter((item) => item.status === 'inProgress');
    const completedTasks = projectTasks?.filter((item) => item.status === 'completed');

    return (
        <div className="project-show">
            {projectTasks && 
                <h1 className="project-name-show">{projectTasks?.[0]?.project}</h1>
            }
            <button className='new-task-button flex border-corner' onClick={() => {setButtonClicked(true)}}>
                <i class="fa-sharp fa-light fa-plus"> Add a new task </i>
            </button>
            { buttonClicked ? 
                <Form onSubmit={handleNewTask} className='new-task-form flex'>
                    <div className="task-field flex">
                        <label> Description</label>
                        <textarea className="border-corner" name='task' placeholder="Enter task description"/>
                    </div>
                    <div className="task-field flex">
                        <label>Priority</label>
                        <select name='priority' className="border-corner">
                            <option value="1">High</option>
                            <option value="2">Medium</option>
                            <option value="3">Low</option>
                        </select>
                    </div>
                    <div className="task-field flex">
                        <label>Status</label>
                        <select name='status' className="border-corner">
                            <option value="toDo">To Do</option>
                            <option value="inProgress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <input className="task-field border-corner create-task-button" type='submit' value='Create Task' />
                    </div>
                </Form>  : null }
            {projectTasks &&
                <div className="project-show-task flex">
                    <GroupedTask tasks={todoTasks} heading={"To do"}/>
                    <GroupedTask tasks={inProgressTasks} heading={"In progress"}/>
                    <GroupedTask tasks={completedTasks} heading={"Completed"}/>
                </div>
            }
        </div>
    );
}

export default ProjectShow;

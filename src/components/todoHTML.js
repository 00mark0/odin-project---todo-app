import DOMPurify from "dompurify";

const todoPage = `
    <div class="todo-container">
        <header>
            <div class="todo-title">
                <h1>To-do App</h1>
            </div>
                <h2>Projects</h2> 
                <nav>
                    <ul id="projects-list">

                    </ul>
                    <button id="add-project"><i class="fas fa-plus"></i> Add a Project</button>
                   <dialog id="add-project-dialog">
                        <form id="add-project-form">
                            <label for="projectName">Project Name</label>
                            <input type="text" id="projectName" name="projectName">
                            <label for="projectDescription">Project Description</label>
                            <input type="text" id="projectDescription" name="projectDescription"></input>
                            <button id="dialogAdd" type="submit">Add Project</button>
                            <button id="cancel-project">Cancel</button>
                        </form> 
                    </dialog> 
                </nav>
        </header>
        <main>
            <div class="proj">
                <h2 id="projTitle"></h2>
                <p id="projDesc"></p>
                </div>
                <div class="task-content">
                <ul id="tasks-list">

                </ul>
                </div>    
            <button id="add-task"><i class="fas fa-plus"></i> Add a Task</button> 
            <dialog id="add-task-dialog">
                <form id="add-task-form">
                    <label for="taskName">Task Name</label>
                    <input type="text" id="taskName" name="taskName">
                    <label for="taskDescription">Task Description</label>
                    <input type="text" id="taskDescription" name="taskDescription"></input>
                    <label for="dueDate">Due Date</label>
                    <input type="date" id="dueDate" name="dueDate"></input>
                    <label for="priority">Priority</label>
                    <select id="priority" name="priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <button id="dialogAddTask" type="submit">Add Task</button>
                    <button id="cancel-task">Cancel</button>
                </form> 
            </dialog> 
        </main>
    </div>
`;

export const cleanTodoPage = DOMPurify.sanitize(todoPage);

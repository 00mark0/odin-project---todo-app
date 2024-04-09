import DOMPurify from "dompurify";

export const initTodo = () => {
  const todoPage = `
    <div class="todo-container">
        <header>
            <div class="todo-title">
                <h1>Todo App</h1>
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

  const cleanTodoPage = DOMPurify.sanitize(todoPage);

  const content = document.getElementById("content");
  content.innerHTML = cleanTodoPage;

  const projectsList = document.getElementById("projects-list");
  const addProject = document.getElementById("add-project");
  const addProjectDialog = document.getElementById("add-project-dialog");
  const dialogAdd = document.getElementById("dialogAdd");
  const closeDialog = document.getElementById("cancel-project");
  const projTitle = document.getElementById("projTitle");
  const projDesc = document.getElementById("projDesc");
  const tasksList = document.getElementById("tasks-list");
  const addTask = document.getElementById("add-task");
  const addTaskDialog = document.getElementById("add-task-dialog");
  const dialogAddTask = document.getElementById("dialogAddTask");
  const closeTaskDialog = document.getElementById("cancel-task");

  let projects = [];
  let currentProject = null;

  class Project {
    constructor(name, description) {
      this.name = name;
      this.description = description;
      this.tasks = [];
    }
  }

  class Task {
    constructor(name, description, dueDate, priority) {
      this.name = name;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
    }
  }

  const createTaskElement = (task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add("taskElement");

    const taskElementCheckbox = document.createElement("input");
    taskElementCheckbox.setAttribute("type", "checkbox");
    taskElement.appendChild(taskElementCheckbox);

    const taskName = document.createElement("span");
    taskName.textContent = task.name;
    taskElement.appendChild(taskName);

    const taskDescription = document.createElement("span");
    taskDescription.textContent = task.description;
    taskElement.appendChild(taskDescription);

    const taskDueDate = document.createElement("span");
    taskDueDate.textContent = task.dueDate;
    taskElement.appendChild(taskDueDate);

    const taskPriority = document.createElement("span");
    taskPriority.textContent = task.priority;
    taskElement.appendChild(taskPriority);

    const taskElementEdit = document.createElement("button");
    const editIconHTML = `<i class="fas fa-edit"></i>`;
    const cleanEditIconHTML = DOMPurify.sanitize(editIconHTML);
    taskElementEdit.innerHTML = cleanEditIconHTML;
    taskElement.appendChild(taskElementEdit);

    const taskElementDelete = document.createElement("button");
    const deleteIconHTML = `<i class="fas fa-trash"></i>`;
    const cleanDeleteIconHTML = DOMPurify.sanitize(deleteIconHTML);
    taskElementDelete.innerHTML = cleanDeleteIconHTML;

    taskElementDelete.addEventListener("click", () => {
      const taskIndex = currentProject.tasks.indexOf(task);

      if (taskIndex !== -1) {
        currentProject.tasks.splice(taskIndex, 1);
      }

      taskElement.remove();
    });

    taskElement.appendChild(taskElementDelete);
    tasksList.appendChild(taskElement);
  };

  addProject.addEventListener("click", () => {
    addProjectDialog.showModal();
  });

  addTask.addEventListener("click", () => {
    if (currentProject === null) {
      alert("Please select a project.");
      return;
    }
    addTaskDialog.showModal();
  });

  dialogAddTask.addEventListener("click", (e) => {
    e.preventDefault();

    const taskName = document.getElementById("taskName");
    const taskDescription = document.getElementById("taskDescription");
    const dueDate = document.getElementById("dueDate");
    const priority = document.getElementById("priority");

    const task = new Task(
      taskName.value,
      taskDescription.value,
      dueDate.value,
      priority.value
    );

    currentProject.tasks.push(task);

    if (taskName.value === "") {
      alert("Please enter a task name.");
      return;
    }

    createTaskElement(task);

    addTaskDialog.close();
  });

  closeTaskDialog.addEventListener("click", (e) => {
    e.preventDefault();
    addTaskDialog.close();
  });

  dialogAdd.addEventListener("click", (e) => {
    e.preventDefault();
    const projectName = document.getElementById("projectName").value;
    const projectDescription =
      document.getElementById("projectDescription").value;
    const project = new Project(projectName, projectDescription);
    projects.push(project);
    currentProject = project;
    console.log(project);

    const projectElement = document.createElement("li");
    projectElement.classList.add("projectElement");
    const projectTitle = document.createElement("span");
    projectTitle.textContent = project.name;
    projectElement.appendChild(projectTitle);

    const projectElementDelete = document.createElement("button");
    const deleteIconHTML = `<i class="fas fa-trash"></i>`;
    const cleanDeleteIconHTML = DOMPurify.sanitize(deleteIconHTML);
    projectElementDelete.innerHTML = cleanDeleteIconHTML;

    projTitle.textContent = project.name;

    projDesc.textContent = project.description;

    if (projectName === "") {
      alert("Please enter a project name.");
      return;
    } else if (projectDescription === "") {
      alert("Please enter a project description.");
      return;
    } else {
      projectElementDelete.addEventListener("click", () => {
        projectElement.remove();
        projTitle.textContent = "";
        projDesc.textContent = "";
      });
    }

    projectElement.appendChild(projectElementDelete);
    projectsList.appendChild(projectElement);

    projectElement.addEventListener("click", () => {
      currentProject = project;
      projTitle.textContent = project.name;
      projDesc.textContent = project.description;

      tasksList.innerHTML = "";

      project.tasks.forEach((task) => {
        createTaskElement(task);
      });
    });
    addProjectDialog.close();
  });

  closeDialog.addEventListener("click", (e) => {
    e.preventDefault();
    addProjectDialog.close();
  });
};

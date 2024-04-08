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
            <div class="tasks">
                <h2 id="projTitle"></h2>
                <p id="projDesc"></p>
                <ul id="tasks-list">

                </ul>
                <button id="add-task"><i class="fas fa-plus"></i> Add a Task</button> 
            </div> 
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

  class Project {
    constructor(name, description) {
      this.name = name;
      this.description = description;
      this.tasks = [];
    }
  }

  addProject.addEventListener("click", () => {
    addProjectDialog.showModal();
  });

  dialogAdd.addEventListener("click", (e) => {
    e.preventDefault();
    const projectName = document.getElementById("projectName").value;
    const projectDescription =
      document.getElementById("projectDescription").value;
    const project = new Project(projectName, projectDescription);
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
      projTitle.textContent = project.name;
      projDesc.textContent = project.description;
    });

    addProjectDialog.close();
  });

  closeDialog.addEventListener("click", (e) => {
    e.preventDefault();
    addProjectDialog.close();
  });
};

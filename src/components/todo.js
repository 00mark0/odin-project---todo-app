import DOMPurify from "dompurify";
import { cleanTodoPage } from "./todoHTML";
import { Project, Task } from "./classes";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import "../styles/main.css";

export const initTodo = () => {
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

  let projects = JSON.parse(localStorage.getItem("projects")) || [];
  let currentProject = null;

  let taskBeingEdited = null;

  const createTaskElement = (task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add("taskElement");

    const taskElementCheckbox = document.createElement("input");
    taskElementCheckbox.setAttribute("type", "checkbox");
    taskElementCheckbox.setAttribute("id", task.id);
    taskElement.appendChild(taskElementCheckbox);

    const savedCheckboxState = localStorage.getItem(task.id);
    if (savedCheckboxState !== null) {
      taskElementCheckbox.checked = savedCheckboxState === "true";
    }

    taskElementCheckbox.addEventListener("change", () => {
      task.completed = taskElementCheckbox.checked;
      localStorage.setItem(task.id, taskElementCheckbox.checked);
      saveProjects();
    });

    const taskName = document.createElement("span");
    taskName.textContent = task.name;
    taskElement.appendChild(taskName);

    const taskDescription = document.createElement("span");
    taskDescription.textContent = task.description;
    taskElement.appendChild(taskDescription);

    const taskDueDate = document.createElement("span");
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    dueDate.setHours(
      today.getHours(),
      today.getMinutes(),
      today.getSeconds(),
      today.getMilliseconds()
    );
    const difference = differenceInDays(dueDate, today);

    if (difference > 0) {
      taskDueDate.textContent = `${formatDistanceToNow(dueDate)} left`;
      taskDueDate.style.color = "green";
    } else if (difference < 0) {
      taskDueDate.textContent = `${formatDistanceToNow(dueDate)} ago`;
      taskDueDate.style.color = "grey";
    } else {
      taskDueDate.textContent = "Due today";
      taskDueDate.style.color = "red";
    }

    taskElement.appendChild(taskDueDate);

    const taskPriority = document.createElement("span");
    taskPriority.textContent = task.priority;

    if (task.priority === "low") {
      taskPriority.style.color = "green";
    } else if (task.priority === "medium") {
      taskPriority.style.color = "orange";
    } else {
      taskPriority.style.color = "red";
    }

    taskElement.appendChild(taskPriority);

    const taskElementEdit = document.createElement("button");
    const editIconHTML = `<i class="fas fa-edit"></i>`;
    const cleanEditIconHTML = DOMPurify.sanitize(editIconHTML);
    taskElementEdit.innerHTML = cleanEditIconHTML;
    taskElement.appendChild(taskElementEdit);

    taskElementEdit.addEventListener("click", () => {
      taskBeingEdited = task;

      document.getElementById("taskName").value = task.name;
      document.getElementById("taskDescription").value = task.description;
      document.getElementById("dueDate").value = task.dueDate;
      document.getElementById("priority").value = task.priority;

      dialogAddTask.textContent = "Edit Task";
      addTaskDialog.showModal();
    });

    const taskElementDelete = document.createElement("button");
    const deleteIconHTML = `<i class="fas fa-trash"></i>`;
    const cleanDeleteIconHTML = DOMPurify.sanitize(deleteIconHTML);
    taskElementDelete.innerHTML = cleanDeleteIconHTML;

    taskElementDelete.addEventListener("click", () => {
      const taskIndex = currentProject.tasks.indexOf(task);

      if (taskIndex !== -1) {
        currentProject.tasks.splice(taskIndex, 1);
        saveProjects();
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

    if (taskBeingEdited) {
      taskBeingEdited.name = taskName.value;
      taskBeingEdited.description = taskDescription.value;
      taskBeingEdited.dueDate = dueDate.value;
      taskBeingEdited.priority = priority.value;

      saveProjects();
      tasksList.innerHTML = "";
      currentProject.tasks.forEach(createTaskElement);
      dialogAddTask.textContent = "Add Task";
    } else {
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
      saveProjects();
    }

    taskBeingEdited = null;
    addTaskDialog.close();
  });

  closeTaskDialog.addEventListener("click", (e) => {
    e.preventDefault();
    addTaskDialog.close();
  });

  dialogAdd.addEventListener("click", (e) => {
    e.preventDefault();

    tasksList.innerHTML = "";

    const projectName = document.getElementById("projectName").value;
    const projectDescription =
      document.getElementById("projectDescription").value;
    const project = new Project(projectName, projectDescription);
    projects.push(project);
    currentProject = project;
    saveProjects();

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
    }

    projectElementDelete.addEventListener("click", (e) => {
      e.stopPropagation();
      const projectIndex = projects.indexOf(project);
      if (projectIndex !== -1) {
        projects.splice(projectIndex, 1);
        saveProjects();
      }
      projectElement.remove();
      projTitle.textContent = "";
      projDesc.textContent = "";
      tasksList.innerHTML = "";

      currentProject = null;
    });

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

  const saveProjects = () => {
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  window.addEventListener("load", () => {
    if (localStorage.getItem("projects")) {
      projects = JSON.parse(localStorage.getItem("projects"));
      projects.forEach((project) => {
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

        projectElementDelete.addEventListener("click", (e) => {
          e.stopPropagation();
          const projectIndex = projects.indexOf(project);
          if (projectIndex !== -1) {
            projects.splice(projectIndex, 1);
            saveProjects();
          }
          projectElement.remove();
          projTitle.textContent = "";
          projDesc.textContent = "";
          tasksList.innerHTML = "";

          currentProject = null;
        });

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
      });
    }
  });
};

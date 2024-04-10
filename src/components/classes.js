export class Project {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.tasks = [];
  }
}

export class Task {
  constructor(name, description, dueDate, priority) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.id = Date.now().toString();
  }
}

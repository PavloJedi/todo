class TaskList {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(id) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        task.deleted = true;
      }
      return task;
    });
  }

  getAll() {
    return this.tasks
      .filter((task) => !task.deleted)
      .map((task) => task.getReadTask());
  }

  getByListId(listId) {
    return this.tasks.filter((task) => task.listId === listId);
  }

  findTask(id) {
    return this.tasks.find((task) => task.id === id);
  }

  updateTask(id, text) {
    const task = this.findTask(id);
    if (task) {
      task.setTaskEdit(text);
    }
  }
  filterByStatus(status) {
    return this.tasks.filter((task) => task.isCompleted === status);
  }
}

export default TaskList;

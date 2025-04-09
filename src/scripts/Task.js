class Task {
  constructor(id, text, isCompleted, listId, deleted = false, dueDate = null) {
    this.id = id;
    this.text = text;
    this.isCompleted = isCompleted;
    this.listId = listId;
    this.deleted = deleted;
    this.dueDate = dueDate;
  }
}

export default Task;

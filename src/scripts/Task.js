class Task {
  constructor(id, text, isCompleted, listId, deleted = false, dueDate = null) {
    this.id = id;
    this.text = text;
    this.isCompleted = isCompleted;
    this.listId = listId;
    this.deleted = deleted;
    this.dueDate = dueDate;
  }
  toggle() {
    this.isCompleted = !this.isCompleted;
  }
  getReadTask() {
    return {
      id: this.id,
      text: this.text,
      isCompleted: this.isCompleted,
    };
  }
  setTaskEdit(text) {
    this.text = text;
  }
}

export default Task;

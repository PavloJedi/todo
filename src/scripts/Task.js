class Task {
  constructor(id, text, isCompleted) {
    this.id = id;
    this.text = text;
    this.isCompleted = isCompleted;
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

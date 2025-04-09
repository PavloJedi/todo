class ListManager {
  constructor() {
    this.list = [];
  }

  createList(name) {
    const list = { id: this.list.length + 1, name, tasks: [] };
    this.list.push(list);
    return list;
  }

  getActiveList() {
    return this.list.find((list) => list.active) || null;
  }

  setActiveList(id) {
    this.list.forEach((list) => (list.active = list.id === id));
  }
}

export default ListManager;

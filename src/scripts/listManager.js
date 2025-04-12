class ListManager {
  constructor(data = { list: [] }) {
    this.list = data.list;
  }

  createList(name) {
    const list = { id: this.list.length + 1, name, tasks: [], active: false };
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

class ListManager {
  constructor() {
    this.list = [];
  }

  createList(name) {
    const list = {
      id: this.list.length + 1,
      name,
      tasks: [],
    };
    this.list.push(list);
    return list;
  }

  getAllLists() {
    return this.list.map((list) => {
      return {
        id: list.id,
        name: list.name,
      };
    });
  }

  getActiveList() {
    return this.list.find((list) => list.active === true);
  }
  setActiveList(id) {
    this.list.forEach((list) => {
      list.active = list.id === id;
    });
  }
}

export default ListManager;

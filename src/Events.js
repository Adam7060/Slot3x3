class Events {
  constructor() {
    if (!Events.instance) {
      this.events = {};
      Events.instance = this;
    }

    return Events.instance;
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;

    this.events[event].forEach(listener => listener(...args));
  }
}

const instance = new Events();
Object.freeze(instance);

export default instance;

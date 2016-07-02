import Stats from './Stats';

export default class {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getStats() {
    return new Stats(this.isFile(), this.isDirectory());
  }

  getName() {
    return this.name;
  }
}

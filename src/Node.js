// @flow

import Stats from './Stats';

export default class {
  name: string;
  isFile: () => bool;
  isDirectory: () => bool;

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

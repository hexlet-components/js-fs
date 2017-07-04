// @flow

import Stats from './Stats';

/**
 * File
 */
export default class {
  name: string;

  /**
   * Constructor
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Get stats
   */
  getStats() {
    return new Stats(this.isFile(), this.isDirectory());
  }

  /**
   * Get name
   */
  getName() {
    return this.name;
  }
}

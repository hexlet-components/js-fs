// @ts-check

import Stats from './Stats.js';

/**
 * File
 */
export default class {
  /**
   * Constructor
   */
  constructor(name) {
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

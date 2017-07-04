// @flow

import Node from './Node';

/**
 * Directory
 */
export default class extends Node {
  /**
   * Constructor
   */
  constructor(name: string) {
    super(name);
    this.file = false;
    this.directory = true;
  }
  /**
   * is directory?
   */
  isDirectory() {
    return this.directory;
  }

  /**
   * is file?
   */
  isFile() {
    return this.file;
  }
}

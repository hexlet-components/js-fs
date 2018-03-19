// @flow

import Node from './Node';

/**
 * File
 */
export default class extends Node {
  body: string;

  /**
   * Constructor
   */
  constructor(name: string, body: string) {
    super(name);
    this.body = body;
    this.file = true;
    this.directory = false;
  }

  /**
   * Get file's body
   */
  getBody() {
    return this.body;
  }

  /**
   * Returns false if it's a regular file.
   * @example
   * const file = new File('file.txt', '');
   * file.isDirectory(); // false
   */
  isDirectory() {
    return this.directory;
  }

  /**
   * Returns true if it's a regular file.
   * @example
   * const file = new File('file.txt', '');
   * file.isFile(); // true
   */
  isFile() {
    return this.file;
  }
}

// @ts-check

import Node from './Node';

/**
 * File
 * @example
 * const file = new File('file.txt', 'body');
 */
export default class extends Node {
  /**
   * Constructor
   */
  constructor(name, body) {
    super(name);
    this.body = body;
    this.file = true;
    this.directory = false;
  }

  /**
   * Get file's body
   * @example
   * const file = new File('file.txt', 'body');
   * file.getBody(); // 'body'
   */
  getBody() {
    return this.body;
  }

  /**
   * Returns false if it's a regular file.
   * @example
   * const file = new File('file.txt', 'body');
   * file.isDirectory(); // false
   */
  isDirectory() {
    return this.directory;
  }

  /**
   * Returns true if it's a regular file.
   * @example
   * const file = new File('file.txt', 'body');
   * file.isFile(); // true
   */
  isFile() {
    return this.file;
  }
}

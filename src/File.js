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

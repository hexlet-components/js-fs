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
    return false;
  }

  /**
   * is file?
   */
  isFile() {
    return true;
  }
}

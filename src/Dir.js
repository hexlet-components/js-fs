// @flow

import Node from './Node';

/**
 * Directory
 */
export default class extends Node {
  /**
   * is directory?
   */
  isDirectory() {
    return true;
  }

  /**
   * is file?
   */
  isFile() {
    return false;
  }
}

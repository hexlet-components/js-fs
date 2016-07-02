// @flow

import Node from './Node';

export default class extends Node {
  isDirectory() {
    return true;
  }

  isFile() {
    return false;
  }
}

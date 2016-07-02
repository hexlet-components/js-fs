// @flow

import Node from './Node';

export default class extends Node {
  body: string;

  constructor(name: string, body: string) {
    super(name);
    this.body = body;
  }

  getBody() {
    return this.body;
  }
}

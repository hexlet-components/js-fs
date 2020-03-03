// @ts-check

export default class extends Error {
  /**
   * Constructor
   */
  constructor(error, path) {
    super(`${error.code}: ${error.description}, ${path}`);

    // this.name = this.constructor.name;
    // this.stack = (new Error()).stack;
    this.code = error.code;
    this.errno = error.errno;
    this.path = path;
  }
}

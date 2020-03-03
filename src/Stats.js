// @ts-check

/**
 * Stats
 */
export default class {
  /**
   * Constructor
   */
  constructor(file, directory) {
    this.file = file;
    this.directory = directory;
  }

  /**
   * is file?
   */
  isFile() {
    return this.file;
  }

  /**
   * is directory?
   */
  isDirectory() {
    return this.directory;
  }
}

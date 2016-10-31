// @flow

/**
 * Stats
 */
export default class {
  file: boolean;
  directory: boolean;

  /**
   * Constructor
   */
  constructor(file: boolean, directory: boolean) {
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


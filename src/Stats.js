// @flow

export default class {
  file: boolean;
  directory: boolean;

  constructor(file: boolean, directory: boolean) {
    this.file = file;
    this.directory = directory;
  }

  isFile() {
    return this.file;
  }

  isDirectory() {
    return this.directory;
  }
}


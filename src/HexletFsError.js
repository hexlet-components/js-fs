// @flow

export default class extends Error {
  code: string;
  errno: number;
  path: string;

  constructor(err: { code: string, errno: number, description: string }, path: string) {
    super(`${err.code}: ${err.description}, ${path}`);

    this.code = err.code;
    this.errno = err.errno;
    this.path = path;
  }
}

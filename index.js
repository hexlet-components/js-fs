// @flow

import errors from 'errno';
import Tree from 'hexlet-trees';

import Dir from  './src/Dir';
import File from  './src/File';

import HexletFsError from  './src/HexletFsError';

const getPathParts = (path: string) =>
  path.split('/').filter(part => part !== '');

export default class {
  tree: Tree;

  constructor() {
    this.tree = new Tree('/');
  }

  unlinkSync(path: string) {
    const parts = getPathParts(path);
    const name = parts[parts.length - 1];
    const current = this.tree.getDeepChild(parts);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, path);
    } else if (current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.EPERM, path);
    }
    return current.parent.removeChild(name);
  }

  rmdirSync(path: string) {
    const parts = getPathParts(path);
    const name = parts[parts.length - 1];
    const current = this.tree.getDeepChild(parts);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, path);
    }
    const node = current.getMeta();
    if (!node.isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, path);
    }
    if (current.hasChildren()) {
      throw new HexletFsError(errors.code.ENOTEMPTY, path);
    }
    current.parent.removeChild(name);
  }

  statSync(path: string) {
    const current = this.tree.getDeepChild(getPathParts(path));
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, path);
    }
    return current.getMeta().getStats();
  }

  mkdirpSync(path: string) {
    getPathParts(path).reduce((subtree, part) => {
      const current = subtree.getChild(part);
      if (!current) {
        return subtree.addChild(part, new Dir(part));
      }
      if (!current.getMeta().isDirectory()) {
        throw new HexletFsError(errors.code.ENOTDIR, path);
      }

      return current;
    }, this.tree);
  }

  readFileSync(path: string) {
    const current = this.tree.getDeepChild(getPathParts(path));
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, path);
    }
    if (current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.EISDIR, path);
    }
    return current.getMeta().getBody();
  }

  readdirSync(path: string) {
    const dir = this.tree.getDeepChild(getPathParts(path));
    if (!dir) {
      throw new HexletFsError(errors.code.ENOENT, path);
    } else if (!dir.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, path);
    }
    return dir.getChildren()
      .map(child => child.getKey());
  }

  writeFileSync(path: string, body: string) {
    const parts = getPathParts(path);
    const name = parts[parts.length - 1];
    const parent = this.tree.getDeepChild(parts.slice(0, -1));
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, path);
    }
    const current = parent.getChild(name);
    if (current && current.getMeta().isDirectory) {
      throw new HexletFsError(errors.code.EISDIR, path);
    }
    parent.addChild(name, new File(name, body));
  }
}

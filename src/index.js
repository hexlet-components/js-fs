// @flow

import errors from 'errno';
import Tree from 'hexlet-trees';

import Dir from './Dir';
import File from './File';

import HexletFsError from './HexletFsError';

const getPathParts = (path: string) =>
  path.split('/').filter(part => part !== '');

export { Dir, File };

/**
 * FS
 */
export default class {
  tree: Tree;

  constructor() {
    this.tree = new Tree('/', new Dir('/'));
  }

  /**
   * Unlink file
   */
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

  /**
   * Remove directory
   */
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

  /**
   * Get file stat
   */
  statSync(path: string) {
    const current = this.tree.getDeepChild(getPathParts(path));
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, path);
    }
    return current.getMeta().getStats();
  }

  /**
   * Make directory
   */
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

  /**
   * Read file
   */
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

  /**
   * Read directory
   */
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

  /**
   * Make directory
   */
  mkdirSync(path: string) {
    const parts = getPathParts(path);
    const name = parts[parts.length - 1];
    const parent = this.tree.getDeepChild(parts.slice(0, -1));
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, path);
    }
    if (!parent.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, path);
    }
    return parent.addChild(name, new Dir(name));
  }

  /**
   * Touch file
   */
  touchSync(path: string) {
    const parts = getPathParts(path);
    const name = parts[parts.length - 1];
    const parent = this.tree.getDeepChild(parts.slice(0, -1));
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, path);
    }
    if (!parent.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, path);
    }
    return parent.addChild(name, new File(name, ''));
  }

  /**
   * Copy file
   */
  copySync(src: string, dest: string) {
    const srcParts = getPathParts(src);
    const node = this.tree.getDeepChild(srcParts);
    if (!node) {
      throw new HexletFsError(errors.code.ENOENT, src);
    }
    if (node.getMeta().getStats().isDirectory()) {
      throw new HexletFsError(errors.code.EISDIR, src);
    }
    const destParts = getPathParts(dest);
    const destParent = this.tree.getDeepChild(destParts.slice(0, -1));
    if (!destParent || destParent.getMeta().getStats().isFile()) {
      throw new HexletFsError(errors.code.ENOENT, dest);
    }

    const destNode = this.tree.getDeepChild(destParts);
    if (destNode.getMeta().isDirectory()) {
      const name = node.getMeta().getName();
      return destNode.addChild(name, new File(name, ''));
    }
    const name = destNode.getMeta().getName();
    return destParent.addChild(name, new File(name, ''));
  }


  /**
   * Write file
   */
  writeFileSync(path: string, body: string) {
    const parts = getPathParts(path);
    const name = parts[parts.length - 1];
    const parent = this.tree.getDeepChild(parts.slice(0, -1));
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, path);
    }
    const current = parent.getChild(name);
    if (current && current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.EISDIR, path);
    }
    parent.addChild(name, new File(name, body));
  }
}

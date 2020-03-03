// @ts-check

import path from 'path';
import errors from 'errno';
import Tree from '@hexlet/trees';

import Dir from './Dir';
import File from './File';

import HexletFsError from './HexletFsError';

const getPathParts = (filepath) =>
  filepath.split(path.sep).filter(part => part !== '');

export { Dir, File };

/**
 * FS
 */
export default class {
  /**
   * Constructor
   */
  constructor() {
    this.tree = new Tree('/', new Dir('/'));
  }

  /**
   * Unlink file
   */
  unlinkSync(filepath) {
    const { base } = path.parse(filepath);
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    } else if (current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.EPERM, filepath);
    }
    return current.parent.removeChild(base);
  }

  /**
   * Remove directory
   */
  rmdirSync(filepath) {
    const { base } = path.parse(filepath);
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    }
    const node = current.getMeta();
    if (!node.isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, filepath);
    }
    if (current.hasChildren()) {
      throw new HexletFsError(errors.code.ENOTEMPTY, filepath);
    }
    current.parent.removeChild(base);
  }

  /**
   * Get file stat
   */
  statSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    }
    return current.getMeta().getStats();
  }

  /**
   * Make directory
   */
  mkdirpSync(filepath) {
    getPathParts(filepath).reduce((subtree, part) => {
      const current = subtree.getChild(part);
      if (!current) {
        return subtree.addChild(part, new Dir(part));
      }
      if (!current.getMeta().isDirectory()) {
        throw new HexletFsError(errors.code.ENOTDIR, filepath);
      }

      return current;
    }, this.tree);
  }

  /**
   * Read file
   */
  readFileSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    }
    if (current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.EISDIR, filepath);
    }
    return current.getMeta().getBody();
  }

  /**
   * Read directory
   */
  readdirSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    } else if (!current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, filepath);
    }
    return current.getChildren().map(child => child.getKey());
  }

  /**
   * Make directory
   */
  mkdirSync(filepath) {
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    }
    if (!parent.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, filepath);
    }
    return parent.addChild(base, new Dir(base));
  }

  /**
   * Touch file
   */
  touchSync(filepath) {
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    }
    if (!parent.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, filepath);
    }
    return parent.addChild(base, new File(base, ''));
  }

  /**
   * Copy file
   */
  copySync(src, dest) {
    const node = this.findNode(src);
    if (!node) {
      throw new HexletFsError(errors.code.ENOENT, src);
    }
    if (node.getMeta().getStats().isDirectory()) {
      throw new HexletFsError(errors.code.EISDIR, src);
    }
    const { dir } = path.parse(dest);
    const destNode = this.findNode(dest);
    const destParent = this.findNode(dir);
    if (!destParent || destParent.getMeta().getStats().isFile()) {
      throw new HexletFsError(errors.code.ENOENT, dest);
    }

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
  writeFileSync(filepath, body) {
    const { dir, base } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, path);
    }
    const current = parent.getChild(base);
    if (current && current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.EISDIR, path);
    }
    parent.addChild(base, new File(base, body));
  }

  findNode(filepath) {
    const parts = getPathParts(filepath);
    return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
  }
}

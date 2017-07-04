// @flow

import 'source-map-support/register';

import path from 'path';
import errors from 'errno';
import Tree from 'hexlet-trees';

import Dir from './Dir';
import File from './File';

import HexletFsError from './HexletFsError';

const getPathParts = (filepath: string) =>
  filepath.split(path.sep).filter(part => part !== '');

export { Dir, File };

/**
 * FS
 */
export default class {
  tree: *;

  /**
   * Constructor
   */
  constructor() {
    this.tree = new Tree('/', new Dir('/'));
  }

  /**
   * Unlink file
   */
  unlinkSync(filepath: string): boolean {
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
  rmdirSync(filepath: string): boolean {
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
  statSync(filepath: string): Stats {
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    }
    return current.getMeta().getStats();
  }

  /**
   * Make directory
   */
  mkdirpSync(filepath: string): Dir {
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
  readFileSync(filepath: string): string {
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
  readdirSync(filepath: string): Array<string> {
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
  mkdirSync(filepath: string): Dir {
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
  touchSync(filepath: string): File {
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
  copySync(src: string, dest: string): File {
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
  writeFileSync(filepath: string, body: string): File {
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

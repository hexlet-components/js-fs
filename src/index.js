// @ts-check

import path from 'path';
import errors from 'errno';
import Tree from '@hexlet/trees';

import Dir from './Dir.js';
import File from './File.js';

import HexletFsError from './HexletFsError.js';

const getPathParts = (filepath) => (
  filepath.split(path.sep).filter((part) => part !== '')
);

export { Dir, File };

/**
 * Make FS
 * @example
 * const fs = new HexletFs();
 */
export default class {
  /**
   * Constructor
   */
  constructor() {
    this.tree = new Tree('/', new Dir('/'));
  }

  /**
   * Make directory
   * @example
   * fs.mkdirSync('/opt');
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
   * Make directory
   * @example
   * fs.mkdirpSync('/etc/nginx/conf.d');
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
   * Remove directory
   * @example
   * fs.rmdirSync('/opt');
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
   * Touch file
   * @example
   * fs.touchSync('/etc/nginx/nginx.conf');
   * fs.touchSync('/etc/hosts');
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
   * Unlink file
   * @example
   * fs.unlinkSync('/etc/nginx/nginx.conf');
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
   * Read directory
   * @example
   * fs.readdirSync('/etc'); // ['nginx', 'hosts']
   */
  readdirSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    } else if (!current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, filepath);
    }
    return current.getChildren().map((child) => child.getKey());
  }

  /**
   * Get file stat
   * @example
   * fs.statSync('/etc/hosts').isFile(); // true
   * fs.statSync('/etc').isDirectory(); // true
   */
  statSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    }
    return current.getMeta().getStats();
  }

  /**
   * Write file
   * @example
   * fs.writeFileSync('/etc/hosts', 'localhost');
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

  /**
   * Read file
   * @example
   * fs.readFileSync('/etc/hosts'); // 'localhost'
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
   * Copy file
   * fs.copySync('/etc/hosts', '/etc/nginx');
   * fs.readdirSync('/etc/nginx'); // [ 'conf.d', 'hosts' ]
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

  findNode(filepath) {
    const parts = getPathParts(filepath);
    return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
  }
}

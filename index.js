// @flow

import Tree from 'hexlet-trees';

import Dir from  './src/Dir';
import File from  './src/File';

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
    const child = this.tree.getDeepChild(parts);
    child.parent.removeChild(name);
  }

  renameSync(oldPath: string, newPath: string) {
    const child = this.tree.getDeepChild(getPathParts(oldPath));
    const newParent = this.tree.getDeepChild(getPathParts(newPath));
    child.parent.removeChild(child.getKey());
    newParent.addChild(child.getKey(), child.getMeta());
  }

  rmdirSync(path: string) {
    const parts = getPathParts(path);
    const name = parts[parts.length - 1];
    const child = this.tree.getDeepChild(parts);
    child.parent.removeChild(name);
  }

  statSync(path: string) {
    const child = this.tree.getDeepChild(getPathParts(path));
    return child.getMeta().getStats();
  }

  mkdirpSync(path: string) {
    getPathParts(path).reduce((subtree, part) =>
      subtree.addChild(part, new Dir(part)), this.tree);
  }

  readFileSync(path: string) {
    const child = this.tree.getDeepChild(getPathParts(path));
    return child.getMeta().getBody();
  }

  readdirSync(path: string) {
    return this.tree.getDeepChild(getPathParts(path))
      .getChildren()
      .map(child => child.getKey());
  }

  writeFileSync(path: string, body: string) {
    const parts = getPathParts(path);
    const name = parts[parts.length - 1];
    const child = this.tree.getDeepChild(parts.slice(0, -1));
    child.addChild(name, new File(name, body));
  }
}

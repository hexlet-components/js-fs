# js-fs

[![github action status](https://github.com/hexlet-components/js-fs/workflows/Node%20CI/badge.svg)](https://github.com/hexlet-components/js-fs/actions)

## Install

```sh
npm install @hexlet/fs --save
```

```javascript
import HexletFs from '@hexlet/fs';
const fs = new HexletFs();

fs.mkdirpSync("/a/test/dir");
fs.writeFileSync("/a/test/dir/file.txt", "Hello World");
fs.readFileSync("/a/test/dir/file.txt"); // returns Hello World

fs.readdirSync("/a/test"); // returns ["dir"]
fs.statSync("/a/test/dir").isDirectory(); // returns true
fs.rmdirSync("/a/test/dir");
```

# js-fs

[![Build Status](https://travis-ci.org/hexlet-components/js-fs.svg?branch=master)](https://travis-ci.org/hexlet-components/js-fs)

```javascript
import HexletFs from 'hexlet-fs';
const fs = new HexletFs();

fs.mkdirpSync("/a/test/dir");
fs.writeFileSync("/a/test/dir/file.txt", "Hello World");
fs.readFileSync("/a/test/dir/file.txt"); // returns Hello World

fs.readdirSync("/a/test"); // returns ["dir"]
fs.statSync("/a/test/dir").isDirectory(); // returns true
fs.rmdirSync("/a/test/dir");
```

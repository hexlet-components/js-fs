# js-fs

[![github action status](https://github.com/hexlet-components/js-fs/workflows/Node%20CI/badge.svg)](https://github.com/hexlet-components/js-fs/actions)

## Install

```sh
npm install @hexlet/fs
```

## Usage example

```javascript
import HexletFs from '@hexlet/fs';
const fs = new HexletFs();

fs.mkdirSync('/opt');
fs.mkdirpSync('/etc/nginx/conf.d');
fs.rmdirSync('/opt');

fs.touchSync('/etc/nginx/nginx.conf');
fs.touchSync('/etc/hosts');
fs.unlinkSync('/etc/nginx/nginx.conf');

fs.readdirSync('/etc'); // ['nginx', 'hosts']
fs.statSync('/etc/hosts').isFile(); // true
fs.statSync('/etc/hosts').isDirectory(); // false
fs.statSync('/etc').isDirectory(); // true

fs.writeFileSync('/etc/hosts', 'localhost');
fs.readFileSync('/etc/hosts'); // 'localhost'

fs.copySync('/etc/hosts', '/etc/nginx');
fs.readdirSync('/etc/nginx'); // [ 'conf.d', 'hosts' ]
```

For more information, see the [Full Documentation](https://github.com/hexlet-components/js-fs/tree/master/docs)

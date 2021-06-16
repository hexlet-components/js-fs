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

[![Hexlet Ltd. logo](https://raw.githubusercontent.com/Hexlet/assets/master/images/hexlet_logo128.png)](https://ru.hexlet.io/pages/about?utm_source=github&utm_medium=link&utm_campaign=js-fs)

This repository is created and maintained by the team and the community of Hexlet, an educational project. [Read more about Hexlet (in Russian)](https://ru.hexlet.io/pages/about?utm_source=github&utm_medium=link&utm_campaign=js-fs).

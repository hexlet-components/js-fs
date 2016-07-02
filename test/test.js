// @flow

import { beforeEach, describe, it } from 'mocha';
import assert from 'assert';

import HexletFs from '../index';

describe('FS', () => {
  let files;

  beforeEach(() => {
    files = new HexletFs();
    files.mkdirpSync('/etc/nginx');
    files.mkdirpSync('/etc/nginx/conf.d');
    files.writeFileSync('/etc/nginx/nginx.conf', 'directives');
  });

  it('#readdirSync', () => {
    assert.deepEqual(files.readdirSync('/etc/nginx'), ['conf.d', 'nginx.conf']);
  });

  it('#readFileSync', () => {
    assert.deepEqual(files.readFileSync('/etc/nginx/nginx.conf'), 'directives');
  });

  it('#unlinkSync', () => {
    files.unlinkSync('/etc/nginx/nginx.conf');
    assert.deepEqual(files.readdirSync('/etc/nginx'), ['conf.d']);
  });

  it('#rmdirSync', () => {
    files.rmdirSync('/etc/nginx/conf.d');
    assert.deepEqual(files.readdirSync('/etc/nginx'), ['nginx.conf']);
  });
});

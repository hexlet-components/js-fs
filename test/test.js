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

  it('#mkdirpSync', () => {
    assert.throws(() => files.mkdirpSync('/etc/nginx/nginx.conf/wrong'), err =>
    err.code === 'ENOTDIR');
  });

  it('#writeFileSync', () => {
    assert.throws(() => files.writeFileSync('/etc/unknown/file', 'body'), err =>
    err.code === 'ENOENT');

    assert.throws(() => files.writeFileSync('/etc', 'body'), err =>
    err.code === 'EISDIR');
  });

  it('#readdirSync', () => {
    assert.deepEqual(files.readdirSync('/etc/nginx'), ['conf.d', 'nginx.conf']);

    assert.throws(() => files.readdirSync('/etc/nginx/undefined'), err =>
      err.code === 'ENOENT');

    assert.throws(() => files.readdirSync('/etc/nginx/nginx.conf'), err =>
      err.code === 'ENOTDIR');
  });

  it('#readFileSync', () => {
    assert.deepEqual(files.readFileSync('/etc/nginx/nginx.conf'), 'directives');

    assert.throws(() => files.readFileSync('/etc/nginx'), err =>
      err.code === 'EISDIR');
    assert.throws(() => files.readFileSync('/etc/unknown'), err =>
      err.code === 'ENOENT');
  });

  it('#unlinkSync', () => {
    files.unlinkSync('/etc/nginx/nginx.conf');
    assert.deepEqual(files.readdirSync('/etc/nginx'), ['conf.d']);

    assert.throws(() => files.unlinkSync('/etc/nginx'), err =>
      err.code === 'EPERM');
  });

  it('#rmdirSync', () => {
    files.rmdirSync('/etc/nginx/conf.d');
    assert.deepEqual(files.readdirSync('/etc/nginx'), ['nginx.conf']);

    assert.throws(() => files.rmdirSync('/etc/unknown'), err =>
      err.code === 'ENOENT');

    assert.throws(() => files.rmdirSync('/etc/nginx'), err =>
      err.code === 'ENOTEMPTY');

    assert.throws(() => files.rmdirSync('/etc/nginx/nginx.conf'), err =>
      err.code === 'ENOTDIR');
  });

  it('#statSync', () => {
    assert.ok(files.statSync('/etc/nginx').isDirectory());
    assert.ok(!files.statSync('/etc/nginx').isFile());

    assert.ok(!files.statSync('/etc/nginx/nginx.conf').isDirectory());
    assert.ok(files.statSync('/etc/nginx/nginx.conf').isFile());

    assert.throws(() => files.statSync('/etc/unknown'), err =>
      err.code === 'ENOENT');
  });
});

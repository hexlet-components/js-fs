// @ts-check

import HexletFs from '../src';

describe('FS', () => {
  let files;

  beforeEach(() => {
    files = new HexletFs();
    files.mkdirpSync('/etc/nginx');
    files.mkdirSync('/opt');
    files.touchSync('/opt/file.txt');
    files.mkdirpSync('/etc/nginx/conf.d');
    files.writeFileSync('/etc/nginx/nginx.conf', 'directives');
  });

  it('#copySync', () => {
    expect(() => files.copySync('undefined', '/etc')).toThrowErrorMatchingSnapshot();

    expect(() => files.copySync('/opt', '/etc')).toThrowErrorMatchingSnapshot();

    expect(() => files.copySync('/op/file.txt', '/etc/file.txt/inner')).toThrowErrorMatchingSnapshot();

    expect(() => files.copySync('/opt/file.txt', '/etc/undefined/inner')).toThrowErrorMatchingSnapshot();

    files.copySync('/opt/file.txt', '/etc');
    expect(files.statSync('/etc/file.txt').isFile()).toBe(true);
    files.copySync('/opt/file.txt', '/etc/nginx/nginx.conf');
    expect(files.readFileSync('/etc/nginx/nginx.conf')).toEqual('');
  });

  it('#mkdirpSync', () => {
    expect(() => files.mkdirpSync('/etc/nginx/nginx.conf/wrong')).toThrowErrorMatchingSnapshot();
  });

  it('#mkdirSync', () => {
    expect(() => files.mkdirSync('/etc/nginx/nginx.conf/wrong')).toThrowErrorMatchingSnapshot();
    expect(() => files.mkdirSync('/opt/folder/inner')).toThrowErrorMatchingSnapshot();

    expect(files.statSync('/opt').isDirectory()).toBe(true);
  });

  it('#touchSync', () => {
    expect(() => files.touchSync('/etc/nginx/nginx.conf/wrong')).toThrowErrorMatchingSnapshot();
    expect(() => files.touchSync('/opt/folder/inner')).toThrowErrorMatchingSnapshot();

    expect(files.statSync('/opt/file.txt').isFile()).toBe(true);
  });

  it('#writeFileSync', () => {
    expect(() => files.writeFileSync('/etc/unknown/file', 'body')).toThrowErrorMatchingSnapshot();

    expect(() => files.writeFileSync('/etc', 'body')).toThrowErrorMatchingSnapshot();
  });

  it('#readdirSync', () => {
    expect(files.readdirSync('/etc/nginx')).toEqual(['conf.d', 'nginx.conf']);

    expect(() => files.readdirSync('/etc/nginx/undefined')).toThrowErrorMatchingSnapshot();

    expect(() => files.readdirSync('/etc/nginx/nginx.conf')).toThrowErrorMatchingSnapshot();
  });

  it('#readFileSync', () => {
    expect(files.readFileSync('/etc/nginx/nginx.conf')).toEqual('directives');

    expect(() => files.readFileSync('/etc/nginx')).toThrowErrorMatchingSnapshot();
    expect(() => files.readFileSync('/etc/unknown')).toThrowErrorMatchingSnapshot();
  });

  it('#unlinkSync', () => {
    files.unlinkSync('/etc/nginx/nginx.conf');
    expect(files.readdirSync('/etc/nginx')).toEqual(['conf.d']);

    expect(() => files.unlinkSync('/etc/nginx')).toThrowErrorMatchingSnapshot();
  });

  it('#rmdirSync', () => {
    files.rmdirSync('/etc/nginx/conf.d');
    expect(files.readdirSync('/etc/nginx')).toEqual(['nginx.conf']);

    expect(() => files.rmdirSync('/etc/unknown')).toThrowErrorMatchingSnapshot();

    expect(() => files.rmdirSync('/etc/nginx')).toThrowErrorMatchingSnapshot();

    expect(() => files.rmdirSync('/etc/nginx/nginx.conf')).toThrowErrorMatchingSnapshot();
  });

  it('#statSync', () => {
    expect(files.statSync('/etc/nginx').isDirectory()).toBe(true);
    expect(files.statSync('/etc/nginx').isFile()).toBe(false);

    expect(files.statSync('/etc/nginx/nginx.conf').isDirectory()).toBe(false);
    expect(files.statSync('/etc/nginx/nginx.conf').isFile()).toBe(true);

    expect(() => files.statSync('/etc/unknown')).toThrowErrorMatchingSnapshot();
  });
});

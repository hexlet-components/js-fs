// @ts-check

import HexletFs from "../src/index.js";

describe("FS", () => {
  let files;

  beforeEach(() => {
    files = new HexletFs();
    files.mkdirpSync("/etc/nginx");
    files.mkdirSync("/opt");
    files.touchSync("/opt/file.txt");
    files.mkdirpSync("/etc/nginx/conf.d");
    files.writeFileSync("/etc/nginx/nginx.conf", "directives");
  });

  it("#copySync", () => {
    expect(() => files.copySync("undefined", "/etc")).toThrowErrorMatchingSnapshot(
      "source does not exist",
    );

    expect(() => files.copySync("/opt", "/etc")).toThrowErrorMatchingSnapshot(
      "source is a directory",
    );

    expect(() =>
      files.copySync("/op/file.txt", "/etc/file.txt/inner"),
    ).toThrowErrorMatchingSnapshot("source path is misspelled");

    expect(() =>
      files.copySync("/opt/file.txt", "/etc/undefined/inner"),
    ).toThrowErrorMatchingSnapshot("destination parent does not exist");

    files.copySync("/opt/file.txt", "/etc");
    expect(files.statSync("/etc/file.txt").isFile()).toBe(true);
    files.copySync("/opt/file.txt", "/etc/nginx/nginx.conf");
    expect(files.readFileSync("/etc/nginx/nginx.conf")).toEqual("");
  });

  it("#mkdirpSync", () => {
    expect(() => files.mkdirpSync("/etc/nginx/nginx.conf/wrong")).toThrowErrorMatchingSnapshot(
      "parent path is a file",
    );
  });

  it("#mkdirSync", () => {
    expect(() => files.mkdirSync("/etc/nginx/nginx.conf/wrong")).toThrowErrorMatchingSnapshot(
      "parent path is a file",
    );
    expect(() => files.mkdirSync("/opt/folder/inner")).toThrowErrorMatchingSnapshot(
      "parent directory does not exist",
    );

    expect(files.statSync("/opt").isDirectory()).toBe(true);
  });

  it("#touchSync", () => {
    expect(() => files.touchSync("/etc/nginx/nginx.conf/wrong")).toThrowErrorMatchingSnapshot(
      "parent path is a file",
    );
    expect(() => files.touchSync("/opt/folder/inner")).toThrowErrorMatchingSnapshot(
      "parent directory does not exist",
    );

    expect(files.statSync("/opt/file.txt").isFile()).toBe(true);
  });

  it("#writeFileSync", () => {
    expect(() => files.writeFileSync("/etc/unknown/file", "body")).toThrowErrorMatchingSnapshot(
      "parent directory does not exist",
    );

    expect(() => files.writeFileSync("/etc", "body")).toThrowErrorMatchingSnapshot(
      "target is a directory",
    );
  });

  it("#readdirSync", () => {
    expect(files.readdirSync("/etc/nginx")).toEqual(["conf.d", "nginx.conf"]);

    expect(() => files.readdirSync("/etc/nginx/undefined")).toThrowErrorMatchingSnapshot(
      "directory does not exist",
    );

    expect(() => files.readdirSync("/etc/nginx/nginx.conf")).toThrowErrorMatchingSnapshot(
      "target is a file",
    );
  });

  it("#readFileSync", () => {
    expect(files.readFileSync("/etc/nginx/nginx.conf")).toEqual("directives");

    expect(() => files.readFileSync("/etc/nginx")).toThrowErrorMatchingSnapshot(
      "target is a directory",
    );
    expect(() => files.readFileSync("/etc/unknown")).toThrowErrorMatchingSnapshot(
      "file does not exist",
    );
  });

  it("#unlinkSync", () => {
    files.unlinkSync("/etc/nginx/nginx.conf");
    expect(files.readdirSync("/etc/nginx")).toEqual(["conf.d"]);

    expect(() => files.unlinkSync("/etc/nginx")).toThrowErrorMatchingSnapshot(
      "target is a directory",
    );
  });

  it("#rmdirSync", () => {
    files.rmdirSync("/etc/nginx/conf.d");
    expect(files.readdirSync("/etc/nginx")).toEqual(["nginx.conf"]);

    expect(() => files.rmdirSync("/etc/unknown")).toThrowErrorMatchingSnapshot(
      "directory does not exist",
    );

    expect(() => files.rmdirSync("/etc/nginx")).toThrowErrorMatchingSnapshot(
      "directory is not empty",
    );

    expect(() => files.rmdirSync("/etc/nginx/nginx.conf")).toThrowErrorMatchingSnapshot(
      "target is a file",
    );
  });

  it("#statSync", () => {
    expect(files.statSync("/etc/nginx").isDirectory()).toBe(true);
    expect(files.statSync("/etc/nginx").isFile()).toBe(false);

    expect(files.statSync("/etc/nginx/nginx.conf").isDirectory()).toBe(false);
    expect(files.statSync("/etc/nginx/nginx.conf").isFile()).toBe(true);

    expect(() => files.statSync("/etc/unknown")).toThrowErrorMatchingSnapshot(
      "path does not exist",
    );
  });
});

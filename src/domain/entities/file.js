class File {
  constructor(path, name, extension) {
    this.path = path;
    this.name = name;
    this.extension = extension.toLowerCase();
  }
}

module.exports = File;
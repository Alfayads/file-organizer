class Rule {
  constructor(category, extensions) {
    this.category = category;
    this.extensions = extensions.map(ext => ext.toLowerCase());
  }

  matches(file) {
    return this.extensions.includes(file.extension);
  }
}

module.exports = Rule;
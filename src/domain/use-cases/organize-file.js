const path = require('path');

class OrganizeFile {
  constructor(fileSystemRepository, rules, sourceFolder) {
    this.fileSystemRepository = fileSystemRepository;
    this.rules = rules;
    this.sourceFolder = sourceFolder; // Store the user-selected folder
  }

  async execute(file) {
    try {
      const rule = this.rules.find(r => r.matches(file)) || this.rules.find(r => r.category === 'Others');
      const targetFolder = path.join(this.sourceFolder, rule.category); // Use sourceFolder as base
      await this.fileSystemRepository.createFolderIfNotExists(targetFolder);
      const targetPath = path.join(targetFolder, file.name);
      await this.fileSystemRepository.moveFile(file.path, targetPath);
      return { success: true, message: `Moved ${file.name} to ${rule.category}` };
    } catch (error) {
      return { success: false, message: `Error moving ${file.name}: ${error.message}` };
    }
  }
}

module.exports = OrganizeFile;
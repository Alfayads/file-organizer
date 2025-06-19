const fs = require('fs').promises;
const path = require('path');

class FileSystemRepository {
  async createFolderIfNotExists(folderPath) {
    try {
      await fs.mkdir(folderPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  async moveFile(sourcePath, targetPath) {
    try {
      await fs.rename(sourcePath, targetPath);
    } catch (error) {
      if (error.code === 'EEXIST') {
        const baseName = path.basename(targetPath, path.extname(targetPath));
        const ext = path.extname(targetPath);
        const newPath = path.join(path.dirname(targetPath), `${baseName}-${Date.now()}${ext}`);
        await fs.rename(sourcePath, newPath);
      } else {
        throw error;
      }
    }
  }
}

module.exports = FileSystemRepository;
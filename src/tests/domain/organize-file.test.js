const OrganizeFile = require('../../domain/use-cases/organize-file');
const Rule = require('../../domain/entities/rule');
const File = require('../../domain/entities/file');

describe('OrganizeFile Use Case', () => {
  const mockFileSystemRepository = {
    createFolderIfNotExists: jest.fn(),
    moveFile: jest.fn()
  };
  const rules = [
    new Rule('Images', ['.png']),
    new Rule('Others', [])
  ];
  const organizeFile = new OrganizeFile(mockFileSystemRepository, rules);

  test('should organize a PNG file to Images folder', async () => {
    const file = new File('/path/to/file.png', 'file.png', '.png');
    mockFileSystemRepository.createFolderIfNotExists.mockResolvedValue();
    mockFileSystemRepository.moveFile.mockResolvedValue();
    
    const result = await organizeFile.execute(file);
    
    expect(mockFileSystemRepository.createFolderIfNotExists).toHaveBeenCalledWith('/path/to/Images');
    expect(mockFileSystemRepository.moveFile).toHaveBeenCalledWith('/path/to/file.png', '/path/to/Images/file.png');
    expect(result.success).toBe(true);
    expect(result.message).toContain('Moved file.png to Images');
  });
});
const { app, BrowserWindow, ipcMain, Tray, Menu, dialog } = require('electron');
const path = require('path');
const chokidar = require('chokidar');
const FileSystemRepository = require('../../interface-adapters/repositories/file-system-repository');
const OrganizeFile = require('../../domain/use-cases/organize-file');
const File = require('../../domain/entities/file');
const Rule = require('../../domain/entities/rule');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(app.getPath('userData'), 'app.log') })
  ]
});

const rules = [
  new Rule('Images', ['.jpg', '.jpeg', '.png', '.gif']),
  new Rule('Documents', ['.pdf', '.doc', '.docx', '.txt']),
  new Rule('Videos', ['.mp4', '.mov', '.avi']),
  new Rule('Others', [])
];

let mainWindow, tray, watcher, sourceFolder;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  try {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open', click: () => mainWindow.show() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() }
    ]);
    tray.setToolTip('File Organizer');
    tray.setContextMenu(contextMenu);
  } catch (error) {
    logger.error(`Failed to create system tray: ${error.message}`);
  }
}

app.whenReady().then(async () => {
  try {
    createWindow();
    createTray();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  } catch (error) {
    logger.error(`Error during app initialization: ${error.message}`);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const fileSystemRepository = new FileSystemRepository();
let organizeFile = null;

ipcMain.handle('select-folder', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    if (!result.canceled) {
      return { success: true, folderPath: result.filePaths[0] };
    }
    return { success: false, message: 'Folder selection canceled' };
  } catch (error) {
    logger.error(`Error selecting folder: ${error.message}`);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('start-monitoring', async (event, folderPath) => {
  try {
    const fs = require('fs').promises;
    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory()) {
      throw new Error(`${folderPath} is not a directory`);
    }

    if (watcher) {
      await watcher.close();
      watcher = null;
    }
    sourceFolder = folderPath;
    organizeFile = new OrganizeFile(fileSystemRepository, rules, sourceFolder);
    watcher = chokidar.watch(folderPath, {
      persistent: true,
      ignoreInitial: false,
      depth: 0 // Restrict to first layer only
    });
    watcher.on('add', async (filePath) => {
      try {
        // Verify file is in the top-level folder
        if (path.dirname(filePath) !== sourceFolder) {
          return; // Skip files in subfolders
        }
        const file = new File(filePath, path.basename(filePath), path.extname(filePath));
        const result = await organizeFile.execute(file);
        logger.info(result.message);
        mainWindow.webContents.send('log-update', result.message);
      } catch (error) {
        logger.error(`Error processing file ${filePath}: ${error.message}`);
      }
    });
    return { success: true, message: `Monitoring ${folderPath}` };
  } catch (error) {
    logger.error(`Error starting monitoring: ${error.message}`);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('stop-monitoring', async () => {
  if (watcher) {
    await watcher.close();
    watcher = null;
    sourceFolder = null;
    organizeFile = null;
    logger.info('Monitoring stopped');
    return { success: true, message: 'Monitoring stopped' };
  }
  return { success: true, message: 'No monitoring active' };
});
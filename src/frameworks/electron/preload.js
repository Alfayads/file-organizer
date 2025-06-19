const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startMonitoring: (folderPath) => ipcRenderer.invoke('start-monitoring', folderPath),
  stopMonitoring: () => ipcRenderer.invoke('stop-monitoring'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  onLogUpdate: (callback) => ipcRenderer.on('log-update', (event, message) => callback(message))
});
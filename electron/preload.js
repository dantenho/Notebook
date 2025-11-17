const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),

  // File dialogs
  selectFile: (options) => ipcRenderer.invoke('select-file', options),

  // Messages
  showMessage: (type, title, message) =>
    ipcRenderer.invoke('show-message', type, title, message),

  // Platform info
  platform: process.platform,
  isElectron: true,
});

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess;
const isDev = !app.isPackaged;

// Porta do backend
const BACKEND_PORT = 3001;
const FRONTEND_URL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../frontend/dist/index.html')}`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../build/icon.png'),
    backgroundColor: '#ffffff',
    show: false, // Don't show until ready
  });

  // Show window when ready to avoid flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL(FRONTEND_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(FRONTEND_URL);
  }

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackend() {
  if (isDev) {
    // Em desenvolvimento, o backend roda separadamente
    console.log('Development mode: Backend should be running separately on port', BACKEND_PORT);
    return;
  }

  // Em produção, iniciar o backend como processo filho
  const backendPath = path.join(__dirname, '../backend/dist/index.js');

  if (!fs.existsSync(backendPath)) {
    console.error('Backend not found at:', backendPath);
    dialog.showErrorBox(
      'Erro ao iniciar',
      'Backend não encontrado. Por favor, reconstrua o aplicativo.'
    );
    app.quit();
    return;
  }

  // Set environment variables
  const userDataPath = app.getPath('userData');
  const env = {
    ...process.env,
    PORT: BACKEND_PORT.toString(),
    NODE_ENV: 'production',
    DATABASE_PATH: path.join(userDataPath, 'database.sqlite'),
    UPLOADS_PATH: path.join(userDataPath, 'uploads'),
  };

  backendProcess = spawn('node', [backendPath], {
    env,
    stdio: 'pipe',
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

// App lifecycle
app.whenReady().then(() => {
  startBackend();

  // Wait a bit for backend to start in production
  if (!isDev) {
    setTimeout(createWindow, 2000);
  } else {
    createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopBackend();
});

// IPC Handlers
ipcMain.handle('get-app-path', (event, name) => {
  return app.getPath(name);
});

ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});

ipcMain.handle('select-file', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-message', async (event, type, title, message) => {
  if (type === 'error') {
    dialog.showErrorBox(title, message);
  } else {
    await dialog.showMessageBox(mainWindow, {
      type,
      title,
      message,
    });
  }
});

// Get app version
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

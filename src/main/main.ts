import { app, BrowserWindow, ipcMain, dialog, globalShortcut, nativeImage } from 'electron';
import * as path from 'path';
import { IPC_CHANNELS } from '../shared/types';
import { sortFiles } from './sorter';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  const icon = nativeImage.createFromPath(
    path.join(__dirname, '..', '..', 'icon', 'AppIcon1024.png'),
  );
  if (process.platform === 'darwin') {
    app.dock.setIcon(icon);
  }

  const mainWindow = new BrowserWindow({
    icon,
    width: 720,
    height: 480,
    resizable: false,
    title: 'RAW-Trash',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // F12 で DevTools トグル
  globalShortcut.register('F12', () => {
    if (mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.closeDevTools();
    } else {
      mainWindow.webContents.openDevTools();
    }
  });

  // ウィンドウを閉じたらアプリ終了
  mainWindow.on('closed', () => {
    globalShortcut.unregisterAll();
    app.quit();
  });
};

ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_FOLDER, async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle(IPC_CHANNELS.SORT_EXECUTE, async (_event, folderPath: string) => {
  return sortFiles(folderPath);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { IPC_CHANNELS, SortResult } from '../shared/types';

contextBridge.exposeInMainWorld('electronAPI', {
  executeSort: (folderPath: string): Promise<SortResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.SORT_EXECUTE, folderPath),
  openFolderDialog: (): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_FOLDER),
});

contextBridge.exposeInMainWorld('webUtils', {
  getPathForFile: (file: File): string => webUtils.getPathForFile(file),
});

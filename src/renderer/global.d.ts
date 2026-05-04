import { SortResult } from '../shared/types';

declare global {
  interface Window {
    electronAPI: {
      executeSort: (folderPath: string) => Promise<SortResult>;
      openFolderDialog: () => Promise<string | null>;
    };
    webUtils: {
      getPathForFile: (file: File) => string;
    };
  }
}

export interface SortResult {
  total: number;
  deleted: number;
  raw: number;
  jpg: number;
}

export const IPC_CHANNELS = {
  SORT_EXECUTE: 'sort:execute',
  DIALOG_OPEN_FOLDER: 'dialog:openFolder',
} as const;

import * as fs from 'fs';
import * as path from 'path';
import { SortResult } from '../shared/types';

const RAW_EXTENSIONS = new Set(['.arw', '.orf', '.cr3', '.cr2']);

function isRaw(ext: string): boolean {
  return RAW_EXTENSIONS.has(ext.toLowerCase());
}

function isJpg(ext: string): boolean {
  return ext.toLowerCase() === '.jpg' || ext.toLowerCase() === '.jpeg';
}

function moveFile(src: string, dest: string): void {
  try {
    fs.renameSync(src, dest);
  } catch {
    // クロスボリューム時は copy + delete にフォールバック
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
  }
}

export function sortFiles(folderPath: string): SortResult {
  if (!fs.existsSync(folderPath)) {
    throw new Error(`フォルダが存在しません: ${folderPath}`);
  }

  const delDir = path.join(folderPath, 'Del');
  const rawDir = path.join(folderPath, 'RAW');
  const jpgDir = path.join(folderPath, 'JPG');

  fs.mkdirSync(delDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(jpgDir, { recursive: true });

  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile());

  // JPGファイルのbasename（小文字）セットを構築
  const jpgBasenames = new Set(
    files
      .filter((f) => isJpg(path.extname(f.name)))
      .map((f) => path.basename(f.name, path.extname(f.name)).toLowerCase()),
  );

  const result: SortResult = { total: 0, deleted: 0, raw: 0, jpg: 0 };

  // Step 2: 孤立RAWをDel/へ
  const rawFiles = files.filter((f) => isRaw(path.extname(f.name)));
  for (const file of rawFiles) {
    const base = path.basename(file.name, path.extname(file.name)).toLowerCase();
    if (!jpgBasenames.has(base)) {
      moveFile(
        path.join(folderPath, file.name),
        path.join(delDir, file.name),
      );
      result.deleted++;
      result.total++;
    }
  }

  // Step 3: 残ったファイルを分類
  const remaining = fs.readdirSync(folderPath, { withFileTypes: true }).filter((e) => e.isFile());
  for (const file of remaining) {
    const ext = path.extname(file.name);
    if (isRaw(ext)) {
      moveFile(
        path.join(folderPath, file.name),
        path.join(rawDir, file.name),
      );
      result.raw++;
      result.total++;
    } else if (isJpg(ext)) {
      moveFile(
        path.join(folderPath, file.name),
        path.join(jpgDir, file.name),
      );
      result.jpg++;
      result.total++;
    }
  }

  return result;
}

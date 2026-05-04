import React, { useState } from 'react';
import { DropZone } from './components/DropZone';
import { Result } from './components/Result';
import { SortResult } from '../shared/types';

export function App() {
  const [folderPath, setFolderPath] = useState('');
  const [result, setResult] = useState<SortResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleDrop = (p: string) => {
    setFolderPath(p);
    setResult(null);
  };

  const handleSelectFolder = async () => {
    const p = await window.electronAPI.openFolderDialog();
    if (p) {
      setFolderPath(p);
      setResult(null);
    }
  };

  const handleExecute = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const r = await window.electronAPI.executeSort(folderPath);
      setResult(r);
    } catch (e) {
      alert(`エラー: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsRunning(false);
    }
  };

  const canExecute = folderPath.trim() && !isRunning;

  return (
    <div style={styles.container}>
      <DropZone onDrop={handleDrop} />

      <div style={styles.row}>
        <button onClick={handleSelectFolder} style={styles.secondaryBtn}>
          フォルダを選択
        </button>
      </div>

      <div style={styles.row}>
        <input
          type="text"
          value={folderPath}
          onChange={(e) => { setFolderPath(e.target.value); setResult(null); }}
          placeholder="/path/to/folder"
          style={styles.input}
        />
      </div>

      <div style={styles.row}>
        <button
          onClick={handleExecute}
          disabled={!canExecute}
          style={canExecute ? styles.primaryBtn : styles.disabledBtn}
        >
          {isRunning ? '処理中...' : '実行'}
        </button>
      </div>

      <div style={styles.divider} />

      <Result result={result} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  row: {
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: '7px 10px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 6,
    color: '#e0e0e0',
    fontSize: 12,
    outline: 'none',
  },
  secondaryBtn: {
    padding: '7px 14px',
    background: '#2e2e2e',
    border: '1px solid #3f3f3f',
    borderRadius: 6,
    color: '#c0c0c0',
    fontSize: 12,
    cursor: 'pointer',
  },
  primaryBtn: {
    padding: '7px 20px',
    background: '#3a7bd5',
    border: 'none',
    borderRadius: 6,
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  disabledBtn: {
    padding: '7px 20px',
    background: '#2a2a2a',
    border: 'none',
    borderRadius: 6,
    color: '#555',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'not-allowed',
  },
  divider: {
    marginTop: 16,
    borderTop: '1px solid #2e2e2e',
  },
};

import React from 'react';
import { SortResult } from '../../shared/types';

interface Props {
  result: SortResult | null;
}

export function Result({ result }: Props) {
  if (!result) return null;

  if (result.total === 0) {
    return (
      <div style={{ marginTop: 14, color: '#555', fontSize: 12 }}>
        対象ファイルが見つかりませんでした
      </div>
    );
  }

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ marginBottom: 10, fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        結果
      </div>
      <div style={styles.grid}>
        <ResultItem label="Del" count={result.deleted} color="#c0392b" />
        <ResultItem label="RAW" count={result.raw} color="#8e6bbf" />
        <ResultItem label="JPG" count={result.jpg} color="#3a7bd5" />
      </div>
    </div>
  );
}

function ResultItem({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ ...styles.card, borderTop: `2px solid ${color}` }}>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#e0e0e0' }}>{count}</div>
      <div style={{ fontSize: 10, color: '#555' }}>件</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  card: {
    background: '#222',
    borderRadius: 6,
    padding: '10px 12px',
    textAlign: 'center',
  },
};

import React, { useState } from 'react';

interface Props {
  onDrop: (folderPath: string) => void;
}

export function DropZone({ onDrop }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const item = e.dataTransfer.items[0];
    if (item && item.kind === 'file') {
      const file = item.getAsFile();
      if (file) {
        const filePath = (window as unknown as { webUtils: { getPathForFile: (f: File) => string } }).webUtils.getPathForFile(file);
        if (filePath) {
          onDrop(filePath);
        }
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${isDragging ? '#3a7bd5' : '#3a3a3a'}`,
        borderRadius: 8,
        padding: '28px 16px',
        textAlign: 'center',
        color: isDragging ? '#3a7bd5' : '#555',
        background: isDragging ? '#1e2a3a' : '#222',
        cursor: 'default',
        transition: 'all 0.15s',
        fontSize: 13,
        letterSpacing: '0.02em',
      }}
    >
      フォルダをここにドロップ
    </div>
  );
}

import { Injectable } from '@angular/core';

export interface StorageEstimate {
  usage: number;
  quota: number;
  usagePercent: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileSystem {
  get isFileSystemAccessSupported(): boolean {
    return 'showOpenFilePicker' in window;
  }

  async openFile(accept?: Record<string, string[]>): Promise<{ name: string; content: string; type: string } | null> {
    if ('showOpenFilePicker' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [handle] = await (window as any).showOpenFilePicker({
        types: accept ? [{ accept }] : undefined,
      });
      const file: File = await handle.getFile();
      const content = await file.text();
      return { name: file.name, content, type: file.type };
    }
    return null;
  }

  readFileViaInput(): Promise<{ name: string; content: string; type: string } | null> {
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) { resolve(null); return; }
        const content = await file.text();
        resolve({ name: file.name, content, type: file.type });
      };
      input.click();
    });
  }

  async saveFile(content: string, suggestedName = 'file.txt'): Promise<boolean> {
    if ('showSaveFilePicker' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handle = await (window as any).showSaveFilePicker({ suggestedName });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        return true;
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return false;
        throw e;
      }
    }
    // Fallback: download link
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content]));
    a.download = suggestedName;
    a.click();
    URL.revokeObjectURL(a.href);
    return false;
  }

  async getStorageEstimate(): Promise<StorageEstimate | null> {
    if (!('storage' in navigator && 'estimate' in navigator.storage)) return null;
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    return { usage, quota, usagePercent: quota ? (usage / quota) * 100 : 0 };
  }

  async writeToOpfs(filename: string, content: string): Promise<void> {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(filename, { create: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const writable = await (fileHandle as any).createWritable();
    await writable.write(content);
    await writable.close();
  }

  async readFromOpfs(filename: string): Promise<string | null> {
    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle(filename);
      const file: File = await fileHandle.getFile();
      return await file.text();
    } catch {
      return null;
    }
  }
}


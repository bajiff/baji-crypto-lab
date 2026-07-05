import type { CipherResult } from '../../domain/entities/CipherResult';
import { HISTORY_LIMIT } from '../../lib/constants';

const HISTORY_KEY = 'cryptolab_history';

// In-memory fallback storage for SSR and Node.js unit test environments (Vitest)
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, val: string): void {
    this.store.set(key, val);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
}

const memoryStorage = new MemoryStorage();

function getStorage() {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      return localStorage;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {
    // Ignore security/access errors in restricted environments
  }
  return memoryStorage;
}

export function getHistory(): CipherResult[] {
  try {
    const storage = getStorage();
    const data = storage.getItem(HISTORY_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed as CipherResult[];
  } catch (err) {
    console.error('Gagal membaca riwayat dari storage:', err);
    return [];
  }
}

export function addHistory(item: Omit<CipherResult, 'id' | 'timestamp'>): CipherResult[] {
  try {
    const current = getHistory();
    const newItem: CipherResult = {
      ...item,
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };

    // Tambahkan ke awal array (terbaru di atas) dan batasi maksimal HISTORY_LIMIT (50 entri)
    const updated = [newItem, ...current].slice(0, HISTORY_LIMIT);
    const storage = getStorage();
    storage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Gagal menyimpan riwayat ke storage:', err);
    return getHistory();
  }
}

export function deleteHistoryItem(id: string): CipherResult[] {
  try {
    const current = getHistory();
    const updated = current.filter((item) => item.id !== id);
    const storage = getStorage();
    storage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Gagal menghapus entri riwayat dari storage:', err);
    return getHistory();
  }
}

export function clearHistory(): void {
  try {
    const storage = getStorage();
    storage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.error('Gagal membersihkan riwayat di storage:', err);
  }
}

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getHistory,
  addHistory,
  deleteHistoryItem,
  clearHistory,
} from '../../src/application/services/history.service';
import { HISTORY_LIMIT } from '../../src/lib/constants';

describe('History Service', () => {
  beforeEach(() => {
    clearHistory();
  });

  it('should return empty array when history is clear', () => {
    const hist = getHistory();
    expect(hist).toEqual([]);
  });

  it('should add history item and store it in localStorage without saving keys', () => {
    const updated = addHistory({
      input: 'Hello Baji',
      output: 'SGVsbG8gQmFqaQ==',
      algorithm: 'Base64',
      mode: 'single',
    });

    expect(updated.length).toBe(1);
    expect(updated[0].input).toBe('Hello Baji');
    expect(updated[0].output).toBe('SGVsbG8gQmFqaQ==');
    expect(updated[0].algorithm).toBe('Base64');
    expect(updated[0].mode).toBe('single');
    expect(updated[0].id).toBeDefined();
    expect(updated[0].timestamp).toBeDefined();

    // Verify localStorage persistence
    const loaded = getHistory();
    expect(loaded).toEqual(updated);
  });

  it('should delete a specific item by id', () => {
    const hist1 = addHistory({ input: 'A', output: 'B', algorithm: 'ROT13', mode: 'single' });
    const hist2 = addHistory({ input: 'C', output: 'D', algorithm: 'Caesar', mode: 'single' });
    expect(hist2.length).toBe(2);

    const idToDelete = hist2[1].id; // The older item
    const afterDelete = deleteHistoryItem(idToDelete);

    expect(afterDelete.length).toBe(1);
    expect(afterDelete[0].input).toBe('C');
  });

  it('should clear all history items', () => {
    addHistory({ input: 'A', output: 'B', algorithm: 'ROT13', mode: 'single' });
    addHistory({ input: 'C', output: 'D', algorithm: 'Caesar', mode: 'single' });
    expect(getHistory().length).toBe(2);

    clearHistory();
    expect(getHistory()).toEqual([]);
  });

  it(`should enforce HISTORY_LIMIT (${HISTORY_LIMIT} max entries) and keep newest entries`, () => {
    for (let i = 1; i <= 55; i++) {
      addHistory({
        input: `Input ${i}`,
        output: `Output ${i}`,
        algorithm: 'Base64',
        mode: 'single',
      });
    }

    const hist = getHistory();
    expect(hist.length).toBe(HISTORY_LIMIT);
    // The newest item (Input 55) should be at index 0
    expect(hist[0].input).toBe('Input 55');
    // The oldest kept item should be Input 6 (since 1..5 were dropped)
    expect(hist[HISTORY_LIMIT - 1].input).toBe('Input 6');
  });
});

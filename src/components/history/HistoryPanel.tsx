import React, { useState } from 'react';
import type { CipherResult } from '../../domain/entities/CipherResult';
import { HISTORY_LIMIT } from '../../lib/constants';
import { CopyButton } from '../shared/CopyButton';
import { History, Trash2, ChevronDown, ChevronUp, Sparkles, Layers, Clock, ArrowRight } from 'lucide-react';

interface HistoryPanelProps {
  history: CipherResult[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onLoadItem?: (item: CipherResult) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onDelete,
  onClearAll,
  onLoadItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return `${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`;
  };

  const truncateText = (text: string, max = 60) => {
    if (text.length <= max) return text;
    return text.substring(0, max) + '...';
  };

  return (
    <div className="w-full rounded-2xl border-3 border-black dark:border-white bg-[#fbebcd] dark:bg-[#1a1a1a] shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#ffffff] overflow-hidden transition-all">
      {/* Header / Toggle Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-[#ffde59] dark:bg-[#facc15] text-black border-b-3 border-black dark:border-white flex items-center justify-between cursor-pointer select-none font-black"
      >
        <div className="flex items-center gap-2.5">
          <History className="w-6 h-6 stroke-[2.5]" />
          <span className="text-base uppercase tracking-wide">
            Riwayat Transformasi Teks
          </span>
          <span className="px-2.5 py-0.5 rounded-full border-2 border-black bg-white text-black text-xs font-black shadow-[2px_2px_0px_0px_#000000]">
            {history.length} / {HISTORY_LIMIT}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && isOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat enkripsi/dekripsi ini?')) {
                  onClearAll();
                }
              }}
              className="px-3 py-1 rounded-lg border-2 border-black bg-red-500 hover:bg-red-600 text-white font-black text-xs shadow-[2px_2px_0px_0px_#000000] flex items-center gap-1 transition-all cursor-pointer"
              title="Hapus semua riwayat"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Bersihkan Semua</span>
            </button>
          )}

          <div className="p-1 rounded-lg border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_#000000]">
            {isOpen ? <ChevronUp className="w-5 h-5 stroke-[3]" /> : <ChevronDown className="w-5 h-5 stroke-[3]" />}
          </div>
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 flex flex-col gap-4 bg-white dark:bg-[#121212]">
          {history.length === 0 ? (
            <div className="p-8 text-center rounded-xl border-2 border-dashed border-black/30 dark:border-white/30 text-gray-500 dark:text-gray-400 font-bold text-sm">
              💤 Belum ada riwayat transformasi teks.
              <p className="text-xs font-medium mt-1">
                Lakukan enkripsi atau dekripsi untuk menyimpan hasil otomatis di dalam browser Anda! (Maksimal {HISTORY_LIMIT} entri)
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border-2 border-black dark:border-white bg-gray-50 dark:bg-[#1e1e1e] flex flex-col gap-2.5 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/15 dark:border-white/15 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded border border-black font-extrabold text-[10px] uppercase flex items-center gap-1 shadow-[1px_1px_0px_0px_#000000] ${
                          item.mode === 'single'
                            ? 'bg-[#ffde59] text-black'
                            : 'bg-[#38bdf8] text-black'
                        }`}
                      >
                        {item.mode === 'single' ? (
                          <Sparkles className="w-3 h-3 stroke-[2.5]" />
                        ) : (
                          <Layers className="w-3 h-3 stroke-[2.5]" />
                        )}
                        {item.mode === 'single' ? 'Single Mode' : 'Pipeline Combo'}
                      </span>
                      <span className="font-black text-xs sm:text-sm text-black dark:text-white">
                        {item.algorithm}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 stroke-[2.5]" />
                        {formatTimestamp(item.timestamp)}
                      </span>

                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="p-1 rounded border border-black dark:border-white bg-red-100 dark:bg-red-950/80 hover:bg-red-500 hover:text-white text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                        title="Hapus item ini dari riwayat"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Input ➔ Output Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-[#121212] flex flex-col justify-between gap-1">
                      <span className="font-sans font-extrabold text-[10px] uppercase text-gray-500 dark:text-gray-400">
                        Input Teks:
                      </span>
                      <p className="text-black dark:text-white break-all line-clamp-2">
                        {truncateText(item.input)}
                      </p>
                    </div>

                    <div className="p-2 rounded-lg border border-black/20 dark:border-white/20 bg-[#4ade80]/15 dark:bg-[#4ade80]/10 flex flex-col justify-between gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-extrabold text-[10px] uppercase text-green-800 dark:text-green-300 flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" /> Output Hasil:
                        </span>
                        <CopyButton textToCopy={item.output} />
                      </div>
                      <p className="text-black dark:text-white font-bold break-all line-clamp-2">
                        {truncateText(item.output)}
                      </p>
                    </div>
                  </div>

                  {onLoadItem && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => onLoadItem(item)}
                        className="text-[11px] font-black underline text-black dark:text-white hover:text-[#38bdf8] cursor-pointer"
                      >
                        + Muat Ulang Input ke Kolom Teks
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

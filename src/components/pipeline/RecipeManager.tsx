import React, { useState, useRef } from 'react';
import {
  exportRecipeToJSON,
  importRecipeFromJSON,
  encodeRecipeToURLParam,
  downloadRecipeAsFile,
} from '../../application/services/recipe.service';
import { type PipelineStepItem } from './PipelineBuilder';
import { Download, Upload, Copy, Share2, FileJson, Check, AlertCircle } from 'lucide-react';

interface RecipeManagerProps {
  steps: PipelineStepItem[];
  onLoadSteps: (steps: PipelineStepItem[]) => void;
}

export const RecipeManager: React.FC<RecipeManagerProps> = ({ steps, onLoadSteps }) => {
  const [copiedType, setCopiedType] = useState<'json' | 'url' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDomainSteps = () =>
    steps.map((s) => ({ cipherId: s.cipherId, keyVal: s.keyVal }));

  const handleCopyJSON = async () => {
    try {
      const jsonStr = exportRecipeToJSON(getDomainSteps(), 'Resep Ekspor CryptoLab');
      await navigator.clipboard.writeText(jsonStr);
      setCopiedType('json');
      setErrorMsg(null);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      setErrorMsg('Gagal menyalin JSON ke clipboard.');
    }
  };

  const handleCopyURL = async () => {
    try {
      const encoded = encodeRecipeToURLParam(getDomainSteps(), 'Resep CryptoLab');
      const shareUrl = `${window.location.origin}${window.location.pathname}?recipe=${encoded}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedType('url');
      setErrorMsg(null);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      setErrorMsg('Gagal membuat link bagikan.');
    }
  };

  const handleDownloadFile = () => {
    try {
      downloadRecipeAsFile(getDomainSteps(), 'resep-cryptolab.json');
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg('Gagal mengunduh file resep.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const recipe = importRecipeFromJSON(text);
      const loaded: PipelineStepItem[] = recipe.steps.map((s, idx) => ({
        id: `imported-${idx}-${Date.now()}`,
        cipherId: s.cipherId,
        keyVal: s.keyVal,
      }));
      onLoadSteps(loaded);
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'File resep tidak valid.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePasteLoad = () => {
    if (!pasteInput.trim()) return;
    try {
      const recipe = importRecipeFromJSON(pasteInput.trim());
      const loaded: PipelineStepItem[] = recipe.steps.map((s, idx) => ({
        id: `pasted-${idx}-${Date.now()}`,
        cipherId: s.cipherId,
        keyVal: s.keyVal,
      }));
      onLoadSteps(loaded);
      setShowPasteModal(false);
      setPasteInput('');
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Format JSON yang ditempel tidak valid.');
    }
  };

  return (
    <div className="flex flex-col gap-3.5 p-4 rounded-2xl border-3 border-black dark:border-white bg-[#ffde59]/20 dark:bg-[#facc15]/10 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
      <div className="flex items-center justify-between border-b-2 border-black/15 dark:border-white/15 pb-2.5">
        <span className="font-black text-sm uppercase tracking-wide flex items-center gap-2 text-black dark:text-white">
          <FileJson className="w-5 h-5 stroke-[2.5] text-[#ffde59] fill-black dark:fill-white" />
          Ekspor / Impor & Bagikan Resep
        </span>
        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black">
          JSON & URL Ready
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl border-2 border-red-600 bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-200 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#dc2626]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Copy Share Link */}
        <button
          type="button"
          onClick={handleCopyURL}
          className="py-2.5 px-3 rounded-xl border-2 border-black dark:border-white bg-[#38bdf8] text-black font-extrabold text-xs shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          title="Salin link URL untuk membagikan resep ini ke orang lain"
        >
          {copiedType === 'url' ? <Check className="w-4 h-4 text-green-950 stroke-[3]" /> : <Share2 className="w-4 h-4 stroke-[2.5]" />}
          <span>{copiedType === 'url' ? 'Link Disalin!' : 'Bagikan URL'}</span>
        </button>

        {/* Download JSON File */}
        <button
          type="button"
          onClick={handleDownloadFile}
          className="py-2.5 px-3 rounded-xl border-2 border-black dark:border-white bg-[#4ade80] text-black font-extrabold text-xs shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          title="Unduh resep pipeline ini sebagai file .JSON"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Unduh JSON</span>
        </button>

        {/* Copy JSON String */}
        <button
          type="button"
          onClick={handleCopyJSON}
          className="py-2.5 px-3 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#1e1e1e] text-black dark:text-white font-extrabold text-xs shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          title="Salin kode teks JSON resep ke clipboard"
        >
          {copiedType === 'json' ? <Check className="w-4 h-4 text-green-600 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
          <span>{copiedType === 'json' ? 'JSON Disalin!' : 'Salin JSON'}</span>
        </button>

        {/* Upload / Import File */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="py-2.5 px-3 rounded-xl border-2 border-black dark:border-white bg-[#c084fc] text-black font-extrabold text-xs shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          title="Unggah file .JSON resep dari komputer Anda"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>Impor JSON</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
          💡 Tips: Anda juga bisa menempel (paste) teks resep JSON secara manual.
        </span>
        <button
          type="button"
          onClick={() => { setShowPasteModal(!showPasteModal); setErrorMsg(null); }}
          className="text-xs font-black underline cursor-pointer text-black dark:text-white hover:text-[#38bdf8]"
        >
          {showPasteModal ? 'Tutup Kolom Tempel' : '+ Tempel JSON Manual'}
        </button>
      </div>

      {showPasteModal && (
        <div className="mt-2 p-3 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#121212] flex flex-col gap-3 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#ffffff]">
          <textarea
            value={pasteInput}
            onChange={(e) => setPasteInput(e.target.value)}
            placeholder='Tempel kode JSON resep di sini... (misal: {"version": "1.0", "steps": [...]})'
            rows={4}
            className="w-full rounded-lg border-2 border-black dark:border-white p-2.5 font-mono text-xs text-black dark:text-white bg-gray-50 dark:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ffde59]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPasteModal(false)}
              className="px-3 py-1.5 rounded-lg border border-black dark:border-white bg-gray-200 dark:bg-gray-800 text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handlePasteLoad}
              className="px-4 py-1.5 rounded-lg border-2 border-black dark:border-white bg-[#ffde59] text-black font-black text-xs shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer"
            >
              Muat Resep Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

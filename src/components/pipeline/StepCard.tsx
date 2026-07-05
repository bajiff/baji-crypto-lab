import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getAllCiphers, type CipherId, cipherRegistry } from '../../infrastructure/ciphers/cipher.registry';
import { GripVertical, Trash2, Sparkles } from 'lucide-react';
import { NeoInput } from '../shared/NeoInput';

interface StepCardProps {
  id: string;
  stepIndex: number;
  cipherId: CipherId;
  keyVal?: string;
  onCipherChange: (id: string, newCipherId: CipherId) => void;
  onKeyChange: (id: string, newKey: string) => void;
  onRemove: (id: string) => void;
  totalSteps: number;
}

export const StepCard: React.FC<StepCardProps> = ({
  id,
  stepIndex,
  cipherId,
  keyVal = '',
  onCipherChange,
  onKeyChange,
  onRemove,
  totalSteps,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: 'relative',
  };

  const currentCipher = cipherRegistry[cipherId];
  const allCiphers = getAllCiphers();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border-3 border-black dark:border-white p-5 transition-all duration-150 flex flex-col gap-4 bg-white dark:bg-[#1e1e1e] ${
        isDragging
          ? 'opacity-90 shadow-[8px_8px_0px_0px_#ffde59] dark:shadow-[8px_8px_0px_0px_#facc15] translate-x-[-2px] translate-y-[-2px] border-dashed border-[#ffde59]'
          : 'shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#000000] dark:hover:shadow-[6px_6px_0px_0px_#ffffff]'
      }`}
    >
      {/* Header / Top bar of Card */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-black/10 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-grab active:cursor-grabbing text-black dark:text-white transition-colors"
            title="Seret untuk mengubah urutan (Drag & Drop)"
            aria-label="Drag handle"
          >
            <GripVertical className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Step Badge */}
          <span className="px-3 py-1 rounded-lg border-2 border-black dark:border-white bg-[#ffde59] dark:bg-[#facc15] text-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]">
            Langkah #{stepIndex + 1}
          </span>
          
          <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400 hidden sm:inline">
            dari {totalSteps} langkah
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(id)}
          disabled={totalSteps <= 1}
          className="p-2 rounded-lg border-2 border-black dark:border-white bg-[#ff5757] text-white hover:bg-[#ff7373] shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer flex items-center justify-center"
          title={totalSteps <= 1 ? 'Minimal harus ada 1 langkah' : 'Hapus langkah ini'}
          aria-label="Hapus langkah"
        >
          <Trash2 className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Controls of Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Algorithm Selector */}
        <div className="flex flex-col gap-1 w-full">
          <label className="font-extrabold text-xs uppercase tracking-wide text-black dark:text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#ffde59] fill-[#ffde59] stroke-[2]" />
            Algoritma Cipher
          </label>
          <select
            value={cipherId}
            onChange={(e) => onCipherChange(id, e.target.value as CipherId)}
            className="w-full rounded-xl border-2 border-black dark:border-white bg-[#fbebcd] dark:bg-[#121212] px-3.5 py-2.5 text-black dark:text-white font-extrabold text-sm shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#ffde59] cursor-pointer transition-all"
          >
            {allCiphers.map((c) => (
              <option key={c.meta.id} value={c.meta.id} className="bg-white dark:bg-[#1e1e1e] text-black dark:text-white font-bold">
                {c.meta.name}
              </option>
            ))}
          </select>
          <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">
            {currentCipher.meta.description}
          </span>
        </div>

        {/* Key Input (if needed) */}
        <div className="w-full">
          {currentCipher.meta.needsKey ? (
            <NeoInput
              label={`🔑 ${currentCipher.meta.name} Parameter`}
              type={currentCipher.meta.keyType === 'number' ? 'number' : 'text'}
              placeholder={currentCipher.meta.keyPlaceholder}
              value={keyVal}
              onChange={(e) => onKeyChange(id, e.target.value)}
              helperText={
                currentCipher.meta.id === 'caesar'
                  ? 'Angka pergeseran abjad (misal: 3 atau -5)'
                  : currentCipher.meta.id === 'vigenere'
                  ? 'Kata kunci abjad (misal: RAHASIA)'
                  : currentCipher.meta.id === 'xor'
                  ? 'Kata kunci bitwise (misal: KEY123)'
                  : currentCipher.meta.id === 'aes'
                  ? 'Kata sandi rahasia untuk Web Crypto AES-256-GCM'
                  : undefined
              }
            />
          ) : (
            <div className="h-full flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-black/30 dark:border-white/30 bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold">
              ✨ Algoritma ini tidak membutuhkan kunci (Symmetric / Static)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

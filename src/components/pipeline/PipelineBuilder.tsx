import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { StepCard } from './StepCard';
import { NeoCard } from '../shared/NeoCard';
import { type CipherId, getAllCiphers } from '../../infrastructure/ciphers/cipher.registry';
import { ArrowDown, ArrowUp, Layers } from 'lucide-react';

export interface PipelineStepItem {
  id: string;
  cipherId: CipherId;
  keyVal: string;
}

interface PipelineBuilderProps {
  steps: PipelineStepItem[];
  onChange: (newSteps: PipelineStepItem[]) => void;
  lastAction: 'encrypt' | 'decrypt' | null;
}

export const PipelineBuilder: React.FC<PipelineBuilderProps> = ({
  steps,
  onChange,
  lastAction,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((item) => item.id === active.id);
      const newIndex = steps.findIndex((item) => item.id === over.id);
      onChange(arrayMove(steps, oldIndex, newIndex));
    }
  };

  const handleAddStep = (cipherId: CipherId = 'base64') => {
    let defaultKey = '';
    if (cipherId === 'caesar') defaultKey = '3';
    else if (cipherId === 'vigenere') defaultKey = 'KUNCI';
    else if (cipherId === 'xor') defaultKey = 'RAHASIA';
    else if (cipherId === 'aes') defaultKey = 'PasswordKu123!';

    const newStep: PipelineStepItem = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      cipherId,
      keyVal: defaultKey,
    };
    onChange([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length <= 1) return;
    onChange(steps.filter((item) => item.id !== id));
  };

  const handleCipherChange = (id: string, newCipherId: CipherId) => {
    let defaultKey = '';
    if (newCipherId === 'caesar') defaultKey = '3';
    else if (newCipherId === 'vigenere') defaultKey = 'KUNCI';
    else if (newCipherId === 'xor') defaultKey = 'RAHASIA';
    else if (newCipherId === 'aes') defaultKey = 'PasswordKu123!';

    onChange(
      steps.map((item) =>
        item.id === id ? { ...item, cipherId: newCipherId, keyVal: defaultKey } : item
      )
    );
  };

  const handleKeyChange = (id: string, newKey: string) => {
    onChange(
      steps.map((item) => (item.id === id ? { ...item, keyVal: newKey } : item))
    );
  };

  const allCiphers = getAllCiphers();

  return (
    <NeoCard variant="cyan" className="flex flex-col gap-6 bg-[#38bdf8]/15 dark:bg-[#0369a1]/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-3 border-black dark:border-white pb-4">
        <div>
          <h3 className="font-black text-xl uppercase tracking-wide flex items-center gap-2.5">
            <Layers className="w-6 h-6 stroke-[2.5]" />
            Pipeline Builder (Mode Kombinasi)
          </h3>
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-0.5">
            Susun urutan transformasi teks. Seret (drag & drop) kartu untuk mengubah urutan eksekusi!
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddStep(e.target.value as CipherId);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="rounded-xl border-3 border-black dark:border-white bg-[#ffde59] dark:bg-[#facc15] px-4 py-2.5 text-black font-black text-sm shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer"
          >
            <option value="" disabled className="bg-white text-black font-bold">
              + Tambah Algoritma
            </option>
            {allCiphers.map((c) => (
              <option key={c.meta.id} value={c.meta.id} className="bg-white text-black font-bold">
                {c.meta.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Execution Flow Indicator Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#121212] font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]">
        <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
          <ArrowDown className="w-4 h-4 stroke-[3] shrink-0" />
          Enkripsi: Atas ➔ Bawah (Langkah #1 ➔ #{steps.length})
        </span>
        <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
          <ArrowUp className="w-4 h-4 stroke-[3] shrink-0" />
          Dekripsi: Bawah ➔ Atas (Langkah #{steps.length} ➔ #1)
        </span>
      </div>

      {/* Sortable Steps List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {steps.map((step, idx) => (
              <StepCard
                key={step.id}
                id={step.id}
                stepIndex={idx}
                cipherId={step.cipherId}
                keyVal={step.keyVal}
                onCipherChange={handleCipherChange}
                onKeyChange={handleKeyChange}
                onRemove={handleRemoveStep}
                totalSteps={steps.length}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex items-center justify-between pt-2 border-t-2 border-black/20 dark:border-white/20 text-xs font-bold text-gray-700 dark:text-gray-300">
        <span>Total Langkah Pipeline: {steps.length} algoritma</span>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset pipeline ke default (3 langkah)?')) {
              onChange([
                { id: 'step-1', cipherId: 'base64', keyVal: '' },
                { id: 'step-2', cipherId: 'caesar', keyVal: '5' },
                { id: 'step-3', cipherId: 'rot13', keyVal: '' },
              ]);
            }
          }}
          className="underline hover:text-red-500 cursor-pointer font-extrabold"
        >
          Reset Pipeline
        </button>
      </div>
    </NeoCard>
  );
};

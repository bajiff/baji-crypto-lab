import React, { useState } from 'react';
import { getAllCiphers, type CipherId, cipherRegistry } from '../../infrastructure/ciphers/cipher.registry';
import { NeoCard } from '../shared/NeoCard';
import { NeoButton } from '../shared/NeoButton';
import { NeoInput } from '../shared/NeoInput';
import { CopyButton } from '../shared/CopyButton';
import { Lock, Unlock, ShieldAlert, Sparkles } from 'lucide-react';

export const EncryptorPanel: React.FC = () => {
  const [selectedCipherId, setSelectedCipherId] = useState<CipherId>('base64');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState<'encrypt' | 'decrypt' | null>(null);

  const currentCipher = cipherRegistry[selectedCipherId];
  const ciphers = getAllCiphers();

  const handleProcess = async (action: 'encrypt' | 'decrypt') => {
    if (!input.trim()) {
      setError('Teks input tidak boleh kosong!');
      return;
    }
    setError(null);
    setIsProcessing(true);
    setLastAction(action);

    try {
      let res = '';
      if (action === 'encrypt') {
        res = await currentCipher.encrypt(input, key);
      } else {
        res = await currentCipher.decrypt(input, key);
      }
      setOutput(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses teks.');
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCipherChange = (id: CipherId) => {
    setSelectedCipherId(id);
    setError(null);
    setOutput('');
    // reset default key hint if changing
    if (id === 'caesar') setKey('3');
    else setKey('');
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* Selector & Meta info */}
      <NeoCard variant="default" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#1e1e1e]">
        <div className="flex flex-col gap-1 w-full md:w-1/2">
          <label htmlFor="cipher-select" className="font-extrabold text-sm uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#ffde59] fill-[#ffde59] stroke-[2.5]" />
            Pilih Algoritma (Fase 1 PoC)
          </label>
          <select
            id="cipher-select"
            value={selectedCipherId}
            onChange={(e) => handleCipherChange(e.target.value as CipherId)}
            className="w-full rounded-xl border-3 border-black dark:border-white bg-[#fbebcd] dark:bg-[#121212] px-4 py-3 text-black dark:text-white font-extrabold text-lg shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#ffde59] transition-all cursor-pointer"
          >
            {ciphers.map((c) => (
              <option key={c.meta.id} value={c.meta.id} className="bg-white dark:bg-[#1e1e1e] text-black dark:text-white">
                {c.meta.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 p-3.5 rounded-xl border-2 border-dashed border-black dark:border-gray-400 bg-gray-50 dark:bg-[#262626] w-full">
          <p className="text-sm font-bold text-black dark:text-white mb-1">💡 {currentCipher.meta.name}</p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
            {currentCipher.meta.description}
          </p>
        </div>
      </NeoCard>

      {/* Main Workspace: Input → Action → Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input Card */}
        <NeoCard variant="default" className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3">
            <span className="font-black text-lg uppercase tracking-wide flex items-center gap-2">
              📥 Input Teks
            </span>
            <button
              onClick={() => { setInput(''); setOutput(''); setError(null); }}
              className="text-xs font-bold underline hover:text-red-500 cursor-pointer text-gray-600 dark:text-gray-400"
            >
              Bersihkan
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik atau tempel teks yang ingin dienkripsi / didekripsi di sini..."
            rows={6}
            className="w-full rounded-xl border-3 border-black dark:border-white bg-white dark:bg-[#121212] p-4 text-black dark:text-white font-mono text-sm shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#ffde59] resize-y min-h-[160px]"
          />

          {currentCipher.meta.needsKey && (
            <div className="mt-1">
              <NeoInput
                label={`🔑 Key / Parameter (${currentCipher.meta.name})`}
                type={currentCipher.meta.keyType === 'number' ? 'number' : 'text'}
                placeholder={currentCipher.meta.keyPlaceholder}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                helperText={currentCipher.meta.id === 'caesar' ? 'Angka bulat (misal: 3 untuk geser 3 huruf ke kanan, -3 ke kiri)' : undefined}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-2">
            <NeoButton
              variant="primary"
              fullWidth
              onClick={() => handleProcess('encrypt')}
              disabled={isProcessing || !input.trim()}
              className="py-3"
            >
              <Lock className="w-5 h-5 stroke-[2.5]" />
              <span>Enkripsi</span>
            </NeoButton>

            <NeoButton
              variant="cyan"
              fullWidth
              onClick={() => handleProcess('decrypt')}
              disabled={isProcessing || !input.trim()}
              className="py-3"
            >
              <Unlock className="w-5 h-5 stroke-[2.5]" />
              <span>Dekripsi</span>
            </NeoButton>
          </div>
        </NeoCard>

        {/* Output Card */}
        <NeoCard variant={output ? 'accent' : 'default'} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3">
            <span className="font-black text-lg uppercase tracking-wide flex items-center gap-2">
              📤 Hasil {lastAction === 'encrypt' ? 'Enkripsi' : lastAction === 'decrypt' ? 'Dekripsi' : 'Output'}
            </span>
            {output && <CopyButton textToCopy={output} />}
          </div>

          {error ? (
            <div className="p-4 rounded-xl border-3 border-red-600 bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-200 flex items-start gap-3 shadow-[4px_4px_0px_0px_#dc2626]">
              <ShieldAlert className="w-6 h-6 stroke-[2.5] text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-sm uppercase mb-1">Terjadi Kesalahan</p>
                <p className="text-xs font-semibold leading-relaxed">{error}</p>
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Hasil transformasi teks akan muncul di sini..."
              rows={6}
              className="w-full rounded-xl border-3 border-black dark:border-white bg-white/90 dark:bg-[#121212]/90 p-4 text-black dark:text-white font-mono text-sm shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#ffffff] focus:outline-none resize-y min-h-[160px] selection:bg-black selection:text-[#ffde59] dark:selection:bg-white dark:selection:text-black"
            />
          )}

          <div className="mt-auto pt-2 flex items-center justify-between text-xs font-bold opacity-80">
            <span>Mode: Single Algorithm (PoC)</span>
            <span>Status: {isProcessing ? '⏳ Memproses...' : output ? '✅ Selesai' : '💤 Menunggu input'}</span>
          </div>
        </NeoCard>
      </div>
    </div>
  );
};

# Planning Aplikasi: baji-crypto-lab
### Web Enkripsi & Dekripsi Kombinasi — Neobrutalism Theme

> Dibuat untuk: Tuan Baji
> Stack: Astro 7 + React 19 (islands) + Tailwind CSS v4
> Prinsip: DRY, KISS, Clean Architecture, Modular

---

## 1. Ringkasan Proyek

Aplikasi web single-purpose yang memungkinkan user:
1. Mengenkripsi/dekripsi teks dengan **satu algoritma** (mode single).
2. Mengenkripsi/dekripsi dengan **kombinasi beberapa algoritma sekaligus**, dijalankan berurutan seperti pipeline (mode combo) — contoh: `Base64 → Caesar → AES` dienkripsi berurutan, lalu didekripsi dengan urutan terbalik.
3. Ganti tema dark/light yang tersinkron di seluruh komponen (termasuk syntax highlight, kartu, tombol neobrutalism).

Karena ini murni **client-side text transformation tool** (bukan aplikasi yang menyimpan data sensitif user), semua proses enkripsi terjadi di browser — tidak ada backend, tidak ada database, tidak ada request ke server untuk memproses teks. Ini penting untuk keamanan (data user tidak pernah keluar dari browser) dan juga menyederhanakan arsitektur (tidak perlu API, auth, dsb).

---

## 2. Kenapa Astro + React + Tailwind (dan versi apa)

| Teknologi | Versi yang dipakai | Alasan |
|---|---|---|
| Astro | **7.x** (rilis Juni 2026, Rust compiler, Vite 8 + Rolldown bundler) | Astro cocok untuk web statis dengan sedikit interaktivitas — hanya bagian encryptor yang perlu jadi React island, sisanya (header, footer, landing) tetap HTML statis → bundle JS kecil, performa cepat |
| React | **19.x** | Dipakai sebagai island (`client:load` / `client:visible`) khusus untuk komponen interaktif (form enkripsi, toggle tema). Manual memoization semakin jarang diperlukan berkat React Compiler |
| Tailwind CSS | **v4.x** (konfigurasi via CSS, bukan `tailwind.config.js`) | Setup lebih ringkas (`@import "tailwindcss"` + `@theme`), performa build jauh lebih cepat, cocok untuk desain neobrutalism yang banyak pakai utility custom (border tebal, shadow offset) |
| @astrojs/react | **6.x** | Integrasi resmi Astro untuk React islands, mendukung React 17/18/19 |

**Catatan penting Astro 7:** butuh Node.js 22.12+, menggunakan Rust compiler baru untuk performa build yang jauh lebih cepat. Markdown pipeline default sekarang menggunakan Sätteri (native Rust) — jika butuh plugin remark/rehype custom, perlu install `@astrojs/markdown-remark` terpisah.

**Kenapa bukan full React SPA (Vite saja)?**
Karena butuh landing page yang SEO-friendly dan cepat (Astro islands = zero JS by default kecuali di komponen yang butuh interaktivitas), sementara bagian "app" (encryptor) tetap punya pengalaman interaktif penuh React.

---

## 3. Prinsip Arsitektur yang Diterapkan

### 3.1 Clean Architecture (disederhanakan untuk frontend)

Karena ini aplikasi frontend tanpa backend, "Clean Architecture" di sini diadaptasi jadi 4 lapisan dengan **arah dependency satu arah**: `UI → Application → Domain ← Infrastructure`

```
┌─────────────────────────────────────────┐
│  UI Layer (Presentation)                 │  ← React components, Astro pages
│  - Tidak tahu detail algoritma enkripsi  │
├─────────────────────────────────────────┤
│  Application Layer (Use Cases)           │  ← orkestrasi: "encryptWithPipeline()"
│  - Menyusun urutan algoritma             │
├─────────────────────────────────────────┤
│  Domain Layer (Core Logic)               │  ← interface Cipher, entity CipherResult
│  - Aturan bisnis murni, tanpa dependency │
├─────────────────────────────────────────┤
│  Infrastructure Layer (Implementations)  │  ← implementasi tiap algoritma cipher
│  - AES, Base64, Caesar, Vigenere, dst    │
└─────────────────────────────────────────┘
```

Kuncinya: **Domain layer mendefinisikan kontrak (`interface Cipher`), Infrastructure yang mengimplementasikan.** UI tidak pernah import langsung dari Infrastructure — selalu lewat Application layer. Ini mencegah bug klasik "UI coupling langsung ke library enkripsi tertentu" yang bikin sulit di-maintain saat ganti library.

### 3.2 DRY (Don't Repeat Yourself)

- Semua algoritma cipher **wajib** mengimplementasikan interface yang sama (`Cipher`), sehingga UI, validasi, dan pipeline logic ditulis **satu kali** dan berlaku untuk semua algoritma — tidak ada `if (algoritma === 'aes') { ... } else if (algoritma === 'caesar') { ... }` yang berulang.
- Registry pattern (lihat §7) untuk daftar algoritma — menambah algoritma baru = 1 file baru + 1 baris registrasi, tidak menyentuh kode lain.

### 3.3 KISS (Keep It Simple, Stupid)

- Tidak pakai state management library berat (Redux/Zustand) — cukup React Context + `useReducer` untuk state pipeline (jumlah step kecil, tidak butuh kompleksitas ekstra).
- Tidak bikin backend/API kalau tidak perlu — semua di client.
- Setiap komponen punya **satu tanggung jawab** (Single Responsibility).

### 3.4 Modular

- Struktur folder per-fitur (`feature-based`), bukan per-tipe file, supaya tiap fitur (encryptor, theme-switcher, history) bisa dikembangkan/dites terpisah.

---

## 4. Struktur Folder

```
baji-crypto-lab/
├── src/
│   ├── domain/                      # Layer paling dalam, tanpa dependency luar
│   │   ├── entities/
│   │   │   └── CipherResult.ts      # { input, output, algorithm, timestamp: number (epoch ms) }
│   │   ├── interfaces/
│   │   │   ├── PipelineStep.ts      # { cipher: Cipher, key?: string } — kontrak pipeline step
│   │   │   └── Cipher.ts            # interface Cipher { encrypt, decrypt, meta }
│   │   └── errors/
│   │       └── CipherError.ts       # custom error class
│   │
│   ├── infrastructure/
│   │   └── ciphers/                 # implementasi tiap algoritma (1 file = 1 algoritma)
│   │       ├── base64.cipher.ts
│   │       ├── caesar.cipher.ts
│   │       ├── rot13.cipher.ts
│   │       ├── vigenere.cipher.ts
│   │       ├── aes.cipher.ts         # pakai Web Crypto API (SubtleCrypto)
│   │       ├── xor.cipher.ts
│   │       └── cipher.registry.ts   # daftar semua cipher (single source of truth)
│   │
│   ├── application/
│   │   └── use-cases/
│   │       ├── encryptSingle.ts
│   │       ├── decryptSingle.ts
│   │       ├── encryptPipeline.ts   # jalankan array cipher berurutan
│   │       └── decryptPipeline.ts   # jalankan reverse-order otomatis
│   │
│   ├── components/                  # React islands (interaktif)
│   │   ├── encryptor/
│   │   │   ├── EncryptorPanel.tsx
│   │   │   ├── AlgorithmSelector.tsx
│   │   │   ├── PipelineBuilder.tsx  # drag-drop susun kombinasi cipher (pakai @dnd-kit/core)
│   │   │   ├── ResultDisplay.tsx
│   │   │   └── useEncryptor.ts      # custom hook: state + logic
│   │   ├── theme/
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── useTheme.ts
│   │   └── shared/
│   │       ├── NeoButton.tsx
│   │       ├── NeoCard.tsx
│   │       ├── NeoInput.tsx
│   │       └── CopyButton.tsx
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro         # head, font, script anti-flash tema
│   │
│   ├── pages/
│   │   ├── index.astro              # landing + encryptor utama
│   │   └── about.astro              # penjelasan tiap algoritma (opsional)
│   │
│   ├── styles/
│   │   └── global.css               # @import "tailwindcss" + @theme neobrutalism
│   │
│   └── lib/
│       └── constants.ts             # nama app, batasan panjang input, dsb
│
├── tests/
│   ├── unit/                        # test tiap cipher (domain+infra)
│   └── integration/                 # test pipeline encrypt→decrypt round-trip
│
├── astro.config.ts
├── tsconfig.json
└── package.json
```

**Alasan struktur ini:** dependency mengalir satu arah (`domain` tidak pernah import dari `infrastructure` atau `components`), sehingga domain logic bisa di-unit-test tanpa perlu render UI sama sekali.

---

## 5. Domain Layer — Kontrak Inti

```typescript
// src/domain/interfaces/Cipher.ts
export interface CipherMeta {
  id: string;              // 'aes' | 'caesar' | dst — dipakai sebagai key registry
  name: string;            // nama tampil, misal "AES-256-GCM"
  needsKey: boolean;       // apakah butuh input key/password dari user
  keyType?: 'number' | 'text' | 'password'; // hint untuk UI input
  keyPlaceholder?: string; // contoh: "Shift 0-25" atau "Enter password"
  description: string;
}

export interface Cipher {
  meta: CipherMeta;
  encrypt(plainText: string, key?: string): Promise<string>;
  decrypt(cipherText: string, key?: string): Promise<string>;
}
```

**Konvensi key per cipher:**

| Cipher | `needsKey` | `keyType` | Interpretasi `key` (string) |
|---|---|---|---|
| Base64 | `false` | — | Tidak digunakan |
| Caesar | `true` | `number` | `parseInt(key)`, shift 0–25, validasi range |
| ROT13 | `false` | — | Tidak digunakan (fixed shift 13) |
| Vigenere | `true` | `text` | Hanya huruf a-z/A-Z, validasi alphabetic |
| XOR | `true` | `text` | Digunakan byte-wise sebagai key |
| AES | `true` | `password` | Password → PBKDF2 derivation + salt acak |

Semua algoritma — dari yang sederhana (Caesar) sampai yang kriptografis kuat (AES) — mengikuti kontrak yang **sama persis**. Ini kunci dari DRY: UI, pipeline runner, dan validasi tidak perlu tahu algoritma spesifik apa yang sedang dijalankan.

**Catatan penting soal keamanan implementasi** (supaya "tidak ada bug"):
- Algoritma seperti Caesar/ROT13/Vigenere/XOR **bukan enkripsi aman** secara kriptografis — ini murni untuk edukasi/fun, dan harus diberi label jelas di UI ("⚠️ Classic cipher — for learning purposes, not secure").
- Untuk AES, **wajib** pakai **Web Crypto API (`SubtleCrypto`)** milik browser, bukan implementasi custom — supaya tidak salah implementasi (bug kriptografi itu sering fatal dan susah dideteksi manual). Gunakan `AES-GCM` (bukan ECB) karena punya integritas data + IV per pesan.
- Key derivation dari password user pakai **PBKDF2** (juga tersedia native di SubtleCrypto) dengan salt acak, bukan langsung dipakai sebagai raw key.

---

## 6. Application Layer — Pipeline Kombinasi

```typescript
// src/application/use-cases/encryptPipeline.ts
import type { PipelineStep } from '../../domain/interfaces/PipelineStep';

export async function encryptPipeline(
  input: string,
  steps: PipelineStep[]
): Promise<string> {
  let result = input;
  for (const step of steps) {
    result = await step.cipher.encrypt(result, step.key);
  }
  return result;
}

export async function decryptPipeline(
  input: string,
  steps: PipelineStep[]
): Promise<string> {
  let result = input;
  // Dekripsi HARUS urutan terbalik dari enkripsi
  for (const step of [...steps].reverse()) {
    result = await step.cipher.decrypt(result, step.key);
  }
  return result;
}
```

> **Catatan:** `PipelineStep` interface didefinisikan di domain layer (`src/domain/interfaces/PipelineStep.ts`), bukan di application layer, supaya kontrak ini bisa dipakai di mana saja tanpa import silang.

**Bug klasik yang dicegah di sini:** lupa membalik urutan saat dekripsi kombinasi. Kalau enkripsi urutannya `A → B → C`, maka dekripsi **wajib** `C → B → A`. Logic ini ditulis satu kali di use-case, jadi tidak mungkin lupa di tempat lain.

---

## 7. Registry Pattern (kunci Modular + DRY)

```typescript
// src/infrastructure/ciphers/cipher.registry.ts
import { base64Cipher } from './base64.cipher';
import { caesarCipher } from './caesar.cipher';
import { rot13Cipher } from './rot13.cipher';
import { vigenereCipher } from './vigenere.cipher';
import { xorCipher } from './xor.cipher';
import { aesCipher } from './aes.cipher';

export const cipherRegistry = {
  base64: base64Cipher,
  caesar: caesarCipher,
  rot13: rot13Cipher,
  vigenere: vigenereCipher,
  xor: xorCipher,
  aes: aesCipher,
  // tambah algoritma baru cukup tambah baris di sini
} as const;

export type CipherId = keyof typeof cipherRegistry;
export const getAllCiphers = () => Object.values(cipherRegistry);
```

Menambah algoritma baru = buat 1 file cipher baru yang implement interface `Cipher`, lalu tambahkan satu baris di registry. Tidak ada bagian lain di codebase yang perlu diubah (UI otomatis menampilkan lewat `getAllCiphers()`).

---

## 8. Desain Neobrutalism + Dark/Light Sync

### 8.1 Ciri visual neobrutalism yang dipakai
- Border tebal solid (2–4px, warna hitam/putih kontras)
- Shadow offset "hard shadow" (bukan blur) — misal `box-shadow: 4px 4px 0 #000`
- Warna cerah/kontras tinggi, tanpa gradient halus
- Tombol punya efek "tekan" (shadow hilang saat `:active`, elemen bergeser sedikit)
- Font tebal, biasanya monospace atau sans-serif tegas

### 8.2 Implementasi tema dengan Tailwind v4

Tailwind v4 dikonfigurasi lewat CSS langsung:

```css
/* src/styles/global.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-neo-bg: #fbebcd;
  --color-neo-bg-dark: #1a1a1a;
  --color-neo-accent: #ffde59;
  --color-neo-border: #000000;
  --color-neo-border-dark: #ffffff;
  --shadow-neo: 4px 4px 0 0 var(--color-neo-border);
  --shadow-neo-dark: 4px 4px 0 0 var(--color-neo-border-dark);
}
```

> **Penting:** Di Tailwind v4, `@custom-variant` dipakai untuk **mendefinisikan** variant baru (level top-level CSS), sedangkan `@variant` dipakai untuk **mengaplikasikan** variant di dalam blok CSS custom. Jangan tertukar!

### 8.3 Sinkronisasi dark/light tanpa "flash" (bug umum!)

Bug paling umum di dark mode: halaman "kedip" putih sesaat sebelum tema gelap diterapkan (FOUC — Flash of Unstyled Content). Solusinya: script inline kecil di `<head>`, dieksekusi **sebelum** render, membaca preferensi dari `localStorage` (atau `prefers-color-scheme` sebagai fallback):

```html
<!-- src/layouts/BaseLayout.astro, di dalam <head>, taruh SEBELUM link CSS -->
<script is:inline>
  const theme = localStorage.getItem('theme')
    ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

Lalu di React island (`useTheme.ts`), state tema **hanya membaca** class yang sudah di-set di `<html>` saat mount (bukan menentukan ulang), supaya tidak ada 2 sumber kebenaran yang bisa konflik (ini juga prinsip KISS: satu source of truth = `document.documentElement.classList` + `localStorage`).

Karena Astro islands di-hydrate independen, toggle tema perlu di-broadcast ke semua island lain yang mungkin ada di halaman (custom event `window.dispatchEvent(new Event('theme-change'))`), supaya semua komponen React yang render warna berbeda tetap sinkron tanpa perlu global state library.

---

## 9. Fitur Detail

| Fitur | Deskripsi |
|---|---|
| **Mode Single** | Pilih 1 algoritma → masukkan teks + key (jika perlu) → enkripsi/dekripsi instan |
| **Mode Kombinasi (Pipeline)** | Susun beberapa algoritma jadi urutan (drag & drop via `@dnd-kit/core` atau tombol tambah), preview urutan, hasil pipeline ditampilkan tiap step (opsional, untuk debugging user) |
| **Riwayat (History)** | Simpan hasil enkripsi terakhir di `localStorage` (bukan server) — maksimal **50 entri** (didefinisikan di `constants.ts`), bisa dihapus |
| **Copy to Clipboard** | Tombol salin hasil, dengan feedback visual "Copied!" |
| **Validasi Input** | Pesan error jelas kalau key kosong (untuk algoritma yang butuh key) atau dekripsi gagal (misal AES dengan key salah → integrity check gagal) |
| **Deteksi Auto (opsional, fase lanjut)** | Coba tebak apakah teks adalah Base64 valid, dsb — hanya UX helper, bukan fitur inti |

---

## 10. Strategi Anti-Bug & Maintainability

1. **Unit test wajib untuk setiap cipher** — test round-trip: `decrypt(encrypt(x)) === x` untuk berbagai jenis input (string kosong, unicode/emoji, string sangat panjang).
2. **Integration test untuk pipeline** — pastikan urutan reverse saat dekripsi benar untuk kombinasi 2–5 algoritma.
3. **TypeScript strict mode** — aktifkan `strict: true` di `tsconfig.json`, supaya error tipe (misal lupa handle `key` yang `undefined`) tertangkap saat development, bukan saat runtime.
4. **Error boundary di React island** — supaya kalau satu cipher error (misal input tidak valid untuk Base64 decode), tidak nge-crash seluruh halaman.
5. **Tidak pernah log/simpan key ke localStorage** — hanya hasil teks yang disimpan di history, key tidak pernah persisted demi keamanan dasar.
6. **Linting & formatting konsisten** — ESLint + Prettier, dijalankan di pre-commit hook (opsional: `husky` + `lint-staged`) supaya style code konsisten dari awal.
7. **Encoding/Unicode handling** — hati-hati saat cipher klasik (Caesar, Vigenere) menerima karakter non-alfabet (emoji, karakter Asia) — tentukan aturan jelas (misal: karakter selain a-z/A-Z dilewati apa adanya) dan test eksplisit untuk ini, karena ini sumber bug paling sering di cipher tools.

---

## 11. Roadmap Pengembangan (bertahap, bukan sekaligus)

**Fase 1 — Fondasi**
- Setup project Astro 7 + React 19 + Tailwind v4
- Bangun domain layer (interface `Cipher`) + 2 cipher sederhana (Base64, Caesar) sebagai proof of concept
- Layout dasar + dark/light toggle tanpa flash

**Fase 2 — Mode Single lengkap**
- Tambahkan cipher lain: ROT13, Vigenere, XOR, AES (Web Crypto)
- UI encryptor mode single, styling neobrutalism penuh
- Unit test semua cipher

**Fase 3 — Mode Kombinasi (Pipeline)**
- `PipelineBuilder` component (susun urutan cipher)
- Use case `encryptPipeline` / `decryptPipeline`
- Integration test round-trip kombinasi

**Fase 4 — Polish**
- History (localStorage), copy button, animasi tekan tombol (neobrutalism style)
- Aksesibilitas (kontras warna dark mode, keyboard navigation)
- Responsive mobile

**Fase 5 — Opsional**
- Halaman "About" penjelasan tiap algoritma (edukatif, cocok untuk portfolio)
- Deteksi otomatis jenis encoding

---

## 12. Ringkasan Perintah Setup

```bash
npm create astro@latest . -- --template minimal --yes
npx astro add react -- --yes
npm install tailwindcss @tailwindcss/vite @dnd-kit/core @dnd-kit/sortable
```

`astro.config.ts`:
```typescript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
```

---

**Catatan penutup:** Astro 7 mensyaratkan Node.js ≥22.12.0 (Tuan Baji sudah `v24.11.1` ✅). Astro 7 menggunakan Rust compiler baru + Vite 8 (Rolldown bundler) untuk performa build yang jauh lebih cepat dibanding Astro 6. Kalau mau, saya bisa bantu jelaskan konsep Web Crypto API lebih dalam dulu sebelum masuk implementasi cipher AES-nya — itu bagian yang paling rawan salah kalau langsung ditulis tanpa paham konsepnya.
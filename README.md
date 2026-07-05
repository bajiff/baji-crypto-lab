# <div align="center">🔐 Baji Crypto Lab</div>

<div align="center">
  <p><strong>Aplikasi Web Enkripsi & Dekripsi Kombinasi (Pipeline & Single Mode) dengan Tema Neobrutalism</strong></p>

  ![Astro](https://img.shields.io/badge/Astro%207.x-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
  ![React](https://img.shields.io/badge/React%2019.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20v4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript%20Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Web Crypto API](https://img.shields.io/badge/Web%20Crypto%20API-4A154B?style=for-the-badge&logo=webrtc&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
</div>

---

**Baji Crypto Lab** adalah aplikasi web *single-purpose* bergaya **Neobrutalism** yang dirancang untuk melakukan transformasi teks kriptografis dan klasikal secara interaktif langsung di dalam browser (*client-side*). Aplikasi ini mendukung eksekusi **Single Mode** maupun **Combination Mode (Pipeline)**, di mana pengguna dapat merangkai berbagai algoritma enkripsi secara berurutan dengan fitur *Drag & Drop*, ekspor/impor resep (*Recipe Manager*), dan berbagi tautan konfigurasi (*URL-based sharing*).

---

## :ledger: Index

- [Introduction](#introduction)
  - [:ledger: Index](#ledger-index)
  - [:beginner: About](#beginner-about)
  - [:zap: Usage](#zap-usage)
    - [:electric\_plug: Installation](#electric_plug-installation)
    - [:package: Commands](#package-commands)
  - [:wrench: Development](#wrench-development)
    - [:notebook: Pre-Requisites](#notebook-pre-requisites)
    - [:nut\_and\_bolt: Development Environment](#nut_and_bolt-development-environment)
    - [:file\_folder: File Structure](#file_folder-file-structure)
    - [:hammer: Build](#hammer-build)
    - [:rocket: Deployment](#rocket-deployment)
  - [:cherry\_blossom: Community](#cherry_blossom-community)
    - [:fire: Contribution](#fire-contribution)
    - [:cactus: Branches](#cactus-branches)
    - [:exclamation: Guideline](#exclamation-guideline)
  - [:question: FAQ](#question-faq)
  - [:page\_facing_up: Resources](#page_facing_up-resources)
  - [:camera: Gallery](#camera-gallery)
  - [:star2: Credit/Acknowledgment](#star2-creditacknowledgment)
  - [:lock: License](#lock-license)

---

## :beginner: About

**Baji Crypto Lab** dikembangkan dengan filosofi arsitektur perangkat lunak modern yang mengutamakan keamanan, kecepatan, dan kemudahan pemeliharaan (*maintainability*). Seluruh proses enkripsi dan dekripsi diproses 100% di sisi klien (*browser-based execution*) tanpa melalui server maupun database eksternal, menjamin bahwa data sensitif pengguna tidak pernah keluar dari peramban.

### ✨ Fitur Unggulan

1. **🔒 Single Mode & ⛓️ Combination Mode (Pipeline):**
   - **Single Mode:** Enkripsi dan dekripsi teks secara instan menggunakan satu algoritma pilihan.
   - **Pipeline Mode:** Gabungkan beberapa algoritma sekaligus (contoh: `Base64 → Caesar → AES-256-GCM`). Enkripsi dieksekusi berurutan dari awal ke akhir, sementara dekripsi **secara otomatis dibalik urutannya** (`AES-256-GCM → Caesar → Base64`) untuk mencegah kesalahan logika kriptografi.
2. **🧩 Recipe Manager & URL Sharing:**
   - Simpan rangkaian pipeline favorit sebagai file JSON (Export/Import).
   - Bagikan konfigurasi enkripsi/dekripsi kompleks kepada rekan tim melalui tautan URL terenkode.
3. **✋ Drag & Drop Pipeline Builder:**
   - Susun dan ubah urutan eksekusi algoritma dengan mudah menggunakan antarmuka interaktif berbasis `@dnd-kit/core`.
4. **🛡️ Algoritma Kriptografi & Klasikal (Registry Pattern):**
   - **AES-256-GCM:** Implementasi standar industri menggunakan **Web Crypto API (`SubtleCrypto`)** native browser dengan derivasi kunci **PBKDF2**, salt acak, dan IV unik per pesan.
   - **Base64:** Encoding/decoding standar RFC 4648.
   - **Caesar Cipher:** Shift cipher klasik dengan validasi rentang nilai (0–25).
   - **ROT13:** Substitusi karakter rotasi 13 statis.
   - **Vigenère Cipher:** Substitusi polialfabis menggunakan kata kunci teks.
   - **XOR Cipher:** Operasi bitwise XOR berbasis byte.
5. **🎨 Desain Neobrutalism & Dark/Light Mode Sync:**
   - Antarmuka visual berani dengan border tebal kontras tinggi, *hard offset shadows* (`4px 4px 0 0 #000`), dan mikro-animasi taktil pada tombol.
   - Sinkronisasi tema gelap/terang tanpa *Flash of Unstyled Content (FOUC)* menggunakan skrip inline pramuat dan penyimpanan status di `localStorage`.

### 🏛️ Arsitektur Sistem (Clean Architecture)

Aplikasi ini menerapkan adaptasi **Clean Architecture** dalam 4 lapisan independen dengan alur ketergantungan satu arah (`UI → Application → Domain ← Infrastructure`):

```
┌────────────────────────────────────────────────────────┐
│ UI Layer (Presentation)                                │ ← React 19 Islands & Astro Pages
│ - Antarmuka interaktif, Drag & Drop, Recipe Manager    │
├────────────────────────────────────────────────────────┤
│ Application Layer (Use Cases)                          │ ← Orkestrasi: encryptPipeline(),
│ - Mengatur urutan eksekusi dan automasi reverse        │   decryptPipeline()
├────────────────────────────────────────────────────────┤
│ Domain Layer (Core Logic)                              │ ← Kontrak murni: interface Cipher,
│ - Aturan bisnis murni tanpa ketergantungan eksternal   │   PipelineStep, CipherResult
├────────────────────────────────────────────────────────┤
│ Infrastructure Layer (Implementations & Registry)      │ ← Implementasi AES (Web Crypto),
│ - Implementasi algoritma konkret & cipherRegistry      │   Base64, Caesar, ROT13, XOR, Vigenère
└────────────────────────────────────────────────────────┘
```

---

## :zap: Usage

### :electric_plug: Installation

Ikuti langkah-langkah detail berikut untuk memasang dan menjalankan proyek ini di lingkungan lokal Anda. Proyek ini mendukung eksekusi langsung via Node.js maupun menggunakan container Docker.

#### 1. Persiapan Repositori
Clone repositori ke mesin lokal Anda dan masuk ke dalam direktori proyek:
```bash
git clone https://github.com/username/baji-crypto-lab.git
cd baji-crypto-lab
```

#### 2. Instalasi Dependensi (Node.js Environment)
Pastikan Anda menggunakan Node.js versi **22.12.0 atau lebih baru** (disarankan v24.x). Instal seluruh dependensi menggunakan `npm`:
```bash
npm install
```

#### 3. Instalasi via Docker (Opsional / Kontainerisasi)
Jika Anda lebih memilih lingkungan terisolasi tanpa menginstal Node.js di sistem host, gunakan Docker Compose yang telah dikonfigurasi dengan Nginx:
```bash
# Membangun image dan menjalankan kontainer di background
docker-compose up -d --build
```

---

### :package: Commands

Berikut adalah daftar perintah CLI yang tersedia untuk pengembangan, pengujian, dan produksi:

| Perintah | Deskripsi Tindakan |
| :--- | :--- |
| `npm install` | Menginstal seluruh dependensi proyek dari `package.json`. |
| `npm run dev` | Memulai server pengembangan lokal secara interaktif di `http://localhost:4321`. |
| `astro dev --background` | **[Astro Background Mode]** Menjalankan dev server di latar belakang (*background job*). |
| `astro dev status` | Mengecek status dan port dari dev server yang berjalan di background. |
| `astro dev logs` | Melihat log keluaran dari dev server background. |
| `astro dev stop` | Menghentikan dev server background yang sedang aktif. |
| `npm run build` | Membangun bundle statis produksi berkecepatan tinggi ke direktori `./dist/`. |
| `npm run preview` | Menjalankan server pratinjau lokal untuk menguji hasil build sebelum deployment. |
| `npm test` | Menjalankan *unit test* dan *integration test* menggunakan **Vitest** (`vitest run`). |
| `npm run test:watch` | Menjalankan Vitest dalam mode *watch* untuk pengembangan berkala. |

---

## :wrench: Development

Kami sangat menyambut kontribusi dari pengembang lain untuk memperluas kapabilitas laboratorium kriptografi ini!

### :notebook: Pre-Requisites

Pastikan sistem Anda memenuhi spesifikasi minimum berikut sebelum memulai pengembangan:
- **Node.js:** Versi `>= 22.12.0` (Wajib untuk kompilator Rust Astro 7.x & Vite 8).
- **Package Manager:** `npm` (v10+), `pnpm`, atau `yarn`.
- **Git:** Untuk kontrol versi dan manajemen percabangan.
- **Docker & Docker Compose:** *(Opsional)* Untuk pengujian deployment web server Nginx.
- **Browser Modern:** Mendukung penuh spesifikasi **Web Crypto API (`window.crypto.subtle`)**.

### :nut_and_bolt: Development Environment

1. **Setup Environment Variables:**
   Proyek ini berjalan secara client-side, namun jika diperlukan konfigurasi port atau environment lokal, salin file contoh:
   ```bash
   cp .env.example .env
   ```
2. **Menjalankan Server Mode Background / Interaktif:**
   Gunakan standar pengembangan Astro:
   ```bash
   # Mode biasa
   npm run dev

   # Mode background (sesuai aturan AGENTS.md)
   astro dev --background
   ```
3. **Menjalankan Pengujian (Testing):**
   Pastikan setiap algoritma cipher yang diubah atau ditambahkan lulus pengujian round-trip (`decrypt(encrypt(text)) === text`):
   ```bash
   npm test
   ```

### :file_folder: File Structure

Struktur direktori disusun berdasarkan pendekatan **Modular Feature-Based & Clean Architecture**:

```bash
baji-crypto-lab/
├── proto-photon/                    # Prototipe atau aset desain eksperimental
├── public/                          # Aset statis eksternal (favicon, gambar, font)
├── src/
│   ├── domain/                      # Lapisan Inti (Tanpa dependensi eksternal)
│   │   ├── entities/
│   │   │   └── CipherResult.ts      # Entitas hasil pemrosesan transformasi
│   │   ├── interfaces/
│   │   │   ├── Cipher.ts            # Kontrak utama interface Cipher { encrypt, decrypt, meta }
│   │   │   └── PipelineStep.ts      # Kontrak langkah rantaian pipeline
│   │   └── errors/
│   │       └── CipherError.ts       # Kelas penanganan error kriptografi custom
│   │
│   ├── application/                 # Lapisan Kasus Penggunaan (Use Cases)
│   │   └── use-cases/
│   │       ├── encryptSingle.ts     # Eksekusi enkripsi mode tunggal
│   │       ├── decryptSingle.ts     # Eksekusi dekripsi mode tunggal
│   │       ├── encryptPipeline.ts   # Eksekusi rantaian enkripsi berurutan
│   │       └── decryptPipeline.ts   # Eksekusi dekripsi dengan auto-reverse order
│   │
│   ├── infrastructure/              # Lapisan Implementasi Konkret
│   │   └── ciphers/
│   │       ├── aes.cipher.ts        # Implementasi AES-256-GCM via Web Crypto API
│   │       ├── base64.cipher.ts     # Implementasi Base64 RFC 4648
│   │       ├── caesar.cipher.ts     # Implementasi Caesar Shift Cipher
│   │       ├── rot13.cipher.ts      # Implementasi ROT13 Substitution
│   │       ├── vigenere.cipher.ts   # Implementasi Vigenère Polyalphabetic
│   │       ├── xor.cipher.ts        # Implementasi XOR Byte-wise
│   │       └── cipher.registry.ts   # Single Source of Truth daftar cipher (Registry Pattern)
│   │
│   ├── components/                  # Lapisan Presentasi (React 19 Islands)
│   │   ├── encryptor/               # Komponen panel utama enkriptor
│   │   ├── pipeline/
│   │   │   ├── PipelineBuilder.tsx  # Drag & drop builder (@dnd-kit)
│   │   │   ├── RecipeManager.tsx    # Ekspor/impor resep & URL sharing
│   │   │   └── StepCard.tsx         # Kartu representasi langkah pipeline
│   │   ├── shared/                  # Komponen UI Neobrutalism reusable (NeoButton, NeoCard)
│   │   └── theme/                   # Komponen & hook pengatur tema Dark/Light
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro         # Layout utama dengan script anti-FOUC
│   │
│   ├── pages/
│   │   └── index.astro              # Halaman utama aplikasi (Astro Island Host)
│   │
│   ├── styles/
│   │   └── global.css               # Token desain Neobrutalism & konfigurasi Tailwind v4
│   │
│   └── lib/
│       └── constants.ts             # Konstanta sistem, batas riwayat, dan metadata
│
├── tests/                           # Pengujian Unit dan Integrasi Vitest
├── Dockerfile                       # Multi-stage Docker build untuk produksi
├── docker-compose.yml               # Orkestrasi kontainer web server Nginx
├── nginx.conf                       # Konfigurasi reverse proxy dan gzip compression
├── astro.config.ts                  # Konfigurasi Astro 7, React, & Tailwind v4
└── package.json                     # Daftar dependensi dan skrip proyek
```

| No | Folder / File | Detail Peran dalam Arsitektur |
| :---: | :--- | :--- |
| **1** | `src/domain/` | Menampung aturan bisnis murni dan kontrak (*interface*). Tidak boleh mengimpor library UI atau infrastruktur apa pun. |
| **2** | `src/application/` | Menampung logika orkestrasi (*use cases*), seperti alur pembalikan otomatis saat dekripsi pipeline kombinasi. |
| **3** | `src/infrastructure/` | Tempat implementasi nyata dari kontrak domain (misal pemanggilan Web Crypto API untuk AES) dan pendaftaran algoritma di *Registry*. |
| **4** | `src/components/` | Komponen interaktif **React 19** yang berjalan sebagai *Astro Islands* (`client:load` / `client:visible`). |
| **5** | `src/styles/global.css` | Pusat konfigurasi desain **Tailwind CSS v4** menggunakan `@import "tailwindcss"` dan deklarasi token `@theme` Neobrutalism. |
| **6** | `Dockerfile` & `nginx.conf` | Blueprint deployment produksi menggunakan Nginx alpine berkinerja tinggi. |

---

### :hammer: Build

Untuk menghasilkan build produksi statis yang siap di-hosting:
```bash
npm run build
```
Proses ini akan mengompilasi seluruh aset statis, mengoptimalkan bundle JavaScript React Islands menggunakan **Rolldown/Vite 8**, dan menyimpannya di direktori `./dist/`. Anda dapat memvalidasi hasil build secara lokal dengan perintah:
```bash
npm run preview
```

---

### :rocket: Deployment

#### 1. Deployment via Docker & Nginx (Direkomendasikan)
Proyek ini telah dilengkapi dengan `Dockerfile` *multi-stage* dan `nginx.conf` untuk performa server web statis optimal dengan kompresi Gzip dan *caching headers*:
```bash
# Build image produksi
docker build -t baji-crypto-lab:latest .

# Jalankan di port 8080
docker run -d -p 8080:80 --name crypto-lab-prod baji-crypto-lab:latest
```

#### 2. Deployment ke Static Cloud Hosting
Karena output build berupa situs statis murni di `./dist/`, Anda dapat langsung men-deploy aplikasi ini ke berbagai platform hosting modern seperti **Vercel**, **Netlify**, **Cloudflare Pages**, atau **GitHub Pages** hanya dengan menghubungkan repositori Git Anda.

---

## :cherry_blossom: Community

Proyek ini bersifat terbuka (*open-source*) dan dibangun untuk kepentingan edukasi kriptografi, eksperimen antarmuka modern, serta produktivitas pengembang.

### :fire: Contribution

Kontribusi Anda sangat berharga! Berikut adalah cara Anda dapat berpartisipasi:

1. **🐞 Laporkan Bug (Report a Bug):**
   Jika Anda menemukan kesalahan perhitungan kriptografi, cacat visual pada tema Neobrutalism, atau *glitch* pada Drag & Drop, silakan buat laporan di [Issues](https://github.com/username/baji-crypto-lab/issues).
2. **💡 Request Fitur Baru (Request a Feature):**
   Ingin menambahkan algoritma cipher baru (misal: ChaCha20, Affine, atau Enigma Machine)? Ajukan ide Anda di [Feature Requests](https://github.com/username/baji-crypto-lab/issues).
3. **🛠️ Buat Pull Request (Create a Pull Request):**
   - Pilih *issue* yang terbuka atau ajukan perbaikan baru.
   - Pastikan implementasi cipher baru mematuhi kontrak `interface Cipher` dan didaftarkan pada `cipherRegistry`.
   - Wajib menyertakan *unit test* Vitest yang membuktikan validitas enkripsi/dekripsi.

> Jika Anda baru mengenal open-source, baca panduan [Cara Membuat Pull Request di GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

---

### :cactus: Branches

Metodologi integrasi berkelanjutan (*Continuous Integration*) yang kami gunakan membagi alur kerja ke dalam cabang-cabang berikut:

1. **`stage`** — Cabang pengembangan utama (*development branch*). Seluruh fitur baru digabungkan dan diuji di sini terlebih dahulu.
2. **`master` / `main`** — Cabang produksi (*production branch*). Hanya berisi kode yang stabil dan siap rilis.
3. **`feat-*` / `fix-*`** — Cabang fitur atau perbaikan sementara yang dibuat dari `stage` dan akan di-merge kembali melalui Pull Request.

**Langkah-langkah bekerja dengan Feature Branch:**
```bash
# 1. Buat branch baru dari stage
git checkout -b feat-nama-fitur-anda stage

# 2. Lakukan perubahan dan commit dengan pesan yang jelas
git commit -m "feat: menambah algoritma affine cipher dan unit test"

# 3. Push ke remote repository dan buka Pull Request ke branch 'stage'
git push origin feat-nama-fitur-anda
```

---

### :exclamation: Guideline

Untuk menjaga kualitas dan arsitektur kode, seluruh kontributor wajib mematuhi pedoman berikut:
- **DRY & Registry Pattern:** Jangan menulis logika `if-else` atau `switch-case` berulang untuk mengecek jenis cipher. Tambahkan algoritma baru sebagai kelas/objek yang mematuhi `interface Cipher` di `src/infrastructure/ciphers/`, lalu daftarkan di `cipherRegistry`.
- **Kriptografi Aman vs Klasikal:** Algoritma edukasional wajib diberi penanda jelas di metadata (`meta.description`). Untuk kriptografi modern (seperti AES), **wajib** menggunakan **Web Crypto API (`window.crypto.subtle`)** — dilarang keras menggunakan implementasi custom yang rentan kerentanan keamanan.
- **TypeScript Strict Mode:** Seluruh kode harus lulus kompilasi dengan konfigurasi `strict: true` tanpa penggunaan tipe `any` yang tidak disengaja.
- **Konsistensi UI Neobrutalism:** Gunakan token warna dan shadow yang telah didefinisikan di `@theme` (`--shadow-neo`, `--color-neo-border`, dll.). Pastikan kontras warna tetap nyaman dibaca pada mode gelap maupun terang.
- **Unit Testing:** Setiap penambahan cipher atau fitur use-case wajib disertai dengan pengujian otomatis menggunakan Vitest.

---

## :question: FAQ

**Q: Mengapa menggunakan kombinasi Astro 7 dan React 19, bukan full React SPA (Vite/Next.js)?**  
**A:** Astro memberikan waktu muat halaman (*load time*) yang secepat kilat dan SEO-friendly dengan mengirimkan *zero JavaScript* secara default pada bagian statis (header, footer, deskripsi). React 19 Islands hanya diaktifkan (`client:load`) khusus pada panel enkriptor interaktif dan Drag & Drop builder.

**Q: Apakah algoritma seperti Caesar, Vigenère, dan XOR aman digunakan untuk menyembunyikan kata sandi atau data sensitif saya?**  
**A:** **TIDAK.** Algoritma klasikal tersebut disediakan semata-mata untuk tujuan edukasi, pembelajaran sejarah kriptografi, dan eksperimen kombinasi logis. Untuk mengamankan data rahasia, gunakan opsi **AES-256-GCM** yang didukung standar enkripsi militer via Web Crypto API.

**Q: Bagaimana cara kerja pembalikan urutan (auto-reverse) pada Combination Mode (Pipeline)?**  
**A:** Secara matematis dan logis, jika sebuah pesan dienkripsi dengan urutan tahap $A \rightarrow B \rightarrow C$, maka untuk mengembalikan pesan ke teks asli, proses dekripsi harus dilakukan dari tahap terakhir menuju tahap pertama, yaitu $C \rightarrow B \rightarrow A$. *Application Layer* kami menangani pembalikan ini secara otomatis saat Anda menekan tombol "Decrypt".

**Q: Apakah data teks atau kata sandi rahasia saya dikirim ke server saat proses enkripsi berlangsung?**  
**A:** **Tidak sama sekali.** Seluruh komputasi — termasuk derivasi kunci PBKDF2 dan operasi AES-GCM — dieksekusi sepenuhnya secara lokal di dalam memori peramban (*client-side browser*) Anda.

---

## :page_facing_up: Resources

Referensi dan dokumentasi resmi teknologi yang digunakan dalam proyek ini:
- **Astro 7 Documentation:** [https://docs.astro.build](https://docs.astro.build)
- **React 19 Reference:** [https://react.dev](https://react.dev)
- **Tailwind CSS v4 Guides:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **MDN Web Crypto API (`SubtleCrypto`):** [https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- **@dnd-kit Drag & Drop Library:** [https://docs.dndkit.com](https://docs.dndkit.com)
- **Vitest Testing Framework:** [https://vitest.dev](https://vitest.dev)

---

## :camera: Gallery

<div align="center">
  <p><em>antarmuka bergaya Neobrutalism dengan kontras tinggi, border tegas, dan shadow offset yang khas.</em></p>
  
  ```
  +-----------------------------------------------------------------------+
  |  [⚙️ BAJI CRYPTO LAB]          [🌙 Dark / ☀️ Light]   [📚 Recipe Manager] |
  +-----------------------------------------------------------------------+
  |  +-------------------------------+   +-----------------------------+  |
  |  | ⛓️ PIPELINE BUILDER (DnD)    |   | 📥 INPUT TEXT / CIPHERTEXT  |  |
  |  |                               |   |                             |  |
  |  |  1. [ 🔑 Base64 Encode     ]  |   | "Hello Tuan Baji, Welcome!" |  |
  |  |  2. [ 🔄 Caesar Shift (+5) ]  |   +-----------------------------+  |
  |  |  3. [ 🛡️ AES-256-GCM (PBKDF2)]|   | ⚡ [ ENCRYPT ]  | [ DECRYPT ] |  |
  |  |                               |   +-----------------------------+  |
  |  |  [ + Add Algorithm Step ]     |   | 📤 OUTPUT RESULT (Copyable) |  |
  |  +-------------------------------+   +-----------------------------+  |
  +-----------------------------------------------------------------------+
  ```
</div>

---

## :star2: Credit/Acknowledgment

Proyek **Baji Crypto Lab** ini digagas dan dirancang untuk:
- 👑 **Tuan Baji** — *Project Owner & Principal Architect*
- 👨‍🏫 **Prof. Dr. Meki** — *Senior Software Engineer & Lead AI Coding Partner*

Terima kasih kepada seluruh komunitas open-source, pengembang Astro, React, dan Tailwind CSS yang telah menyediakan peralatan luar biasa untuk membangun aplikasi web modern yang cepat dan indah.

---

## :lock: License

Didistribusikan di bawah lisensi **MIT License**. Lihat berkas [LICENSE](https://opensource.org/licenses/MIT) untuk informasi lebih lanjut.

---
<div align="center">
  <p>Dibuat dengan 💛 dan ketelitian kriptografis tinggi oleh <strong>Prof. Dr. Meki</strong> untuk <strong>Tuan Baji</strong>.</p>
</div>

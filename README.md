# Organize - Platform Manajemen Acara

## Deskripsi Proyek

### Latar Belakang
Dalam ekosistem acara modern, penyelenggara seperti Hacktiv8 sering mengandalkan solusi manual yang terfragmentasi untuk mengelola pendaftaran peserta. Proses ini biasanya melibatkan pembuatan Google Form untuk pengumpulan data, yang kemudian dilanjutkan dengan konfirmasi pembayaran manual di mana peserta harus mengirimkan bukti transfer berupa screenshot. Alur kerja seperti ini tidak hanya merepotkan bagi penyelenggara, tetapi juga menciptakan pengalaman yang kurang profesional dan rentan terhadap kesalahan bagi para pendaftar.

### Solusi
"Organize" dirancang sebagai platform terpusat untuk memecahkan masalah ini. Aplikasi ini bertujuan untuk mengotomatiskan dan menyederhanakan proses manajemen acara dari awal hingga akhir. Bagi penyelenggara, ini berarti tidak perlu lagi membuat form manual. Bagi peserta, ini memberikan pengalaman pendaftaran yang mulus, cepat, dan terpercaya, tanpa perlu lagi melakukan konfirmasi pembayaran secara manual.

Proyek ini dibuat sebagai **Full Functioning Web-Application** untuk Capstone Project "Code Generations and Optimization with IBM Granite" dari Hacktiv8.

## Fitur Utama

### Autentikasi & Otorisasi Berbasis Peran
- Pengguna dapat mendaftar dan login
- Sistem peran ganda: **participant** (peserta) dan **organizer**
- Pengguna baru otomatis menjadi participant
- Pengguna dapat mengajukan permohonan untuk menjadi organizer dengan mengisi data tambahan
- Rute privat yang dilindungi untuk pengguna yang sudah login (`ProtectedRoute`)
- Rute khusus organizer untuk fitur manajemen acara (`OrganizerRoute`)

### Manajemen Acara (CRUD)
- **Create**: Organizer dapat membuat acara baru dengan detail lengkap
- **Read**: Semua pengguna dapat melihat daftar acara dengan paginasi, filter, dan pencarian. Pengguna dapat melihat halaman detail untuk setiap acara
- **Update**: Organizer dapat mengedit detail acara yang telah mereka buat
- **Delete**: Organizer dapat menghapus acara mereka

### Fitur untuk Organizer
- **Dashboard "Acara Saya"**: Menampilkan semua acara yang dibuat oleh organizer yang sedang login
- **Lihat Pendaftar**: Organizer dapat melihat daftar lengkap peserta yang telah mendaftar di acaranya beserta jawaban form kustom
- **Form Pendaftaran Kustom**: Organizer dapat membuat form pendaftaran dinamis dengan pertanyaan kustom untuk setiap acara

### Fitur untuk Peserta
- **Pendaftaran Acara**: Peserta dapat mendaftar untuk acara (gratis maupun berbayar)
- **Dashboard "Tiket Saya"**: Menampilkan semua acara yang telah didaftari oleh peserta, beserta status pembayarannya (`paid`, `pending`, `cancelled`)

### Profil Pengguna & Organizer
- Pengguna dapat melihat dan memperbarui data profil mereka
- Pengguna juga dapat melihat profil publik dari setiap organizer

### Fitur Tambahan
- **Upload Gambar**: Organizer dapat mengunggah gambar poster untuk acara mereka, yang disimpan di Cloudinary
- **Integrasi Pembayaran**: Sistem pembayaran untuk acara berbayar menggunakan Midtrans (mode sandbox)
- **Notifikasi Webhook**: Konfirmasi pembayaran otomatis dari Midtrans untuk mengubah status pendaftaran dari `pending` menjadi `paid`
- **Pencarian & Filter**: Pengguna dapat mencari acara berdasarkan kata kunci dan memfilternya berdasarkan harga dan tanggal
- **Landing Page**: Halaman depan yang menarik untuk pengunjung yang belum login

## Teknologi yang Digunakan

### Frontend
- React
- Vite
- MUI (Material-UI)
- React Router
- Axios
- SweetAlert2

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Layanan Pihak Ketiga
- Midtrans
- Cloudinary
- Vercel (Deployment Backend)
- Netlify (Deployment Frontend)

## Panduan Instalasi Lokal

### Backend
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` dan isi variabel yang dibutuhkan:
   - `MONGO_URI`
   - `JWT_SECRET`
   - Kunci API Cloudinary & Midtrans

4. Jalankan server:
   ```bash
   npm run start
   ```

### Frontend
1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` dan isi variabel yang dibutuhkan:
   - `VITE_API_URL`
   - `VITE_MIDTRANS_CLIENT_KEY`

4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

## Penjelasan Dukungan AI (IBM Granite)

Selama pengembangan proyek "Organize", AI (IBM Granite) digunakan sebagai asisten pemrograman untuk mempercepat dan meningkatkan kualitas kode, sesuai dengan brief proyek. Berikut adalah beberapa contoh penggunaannya:

### Pembuatan Kode Awal (Boilerplate)
- **Prompt**: "Buatkan saya controller registerUser di Node.js menggunakan Express dan Mongoose..."
- **Dampak**: AI secara cepat menghasilkan kerangka kerja lengkap untuk fungsi-fungsi CRUD dan autentikasi, menghemat waktu development awal secara signifikan

### Debugging Error
- **Prompt**: "Saya mendapatkan error 500 Internal Server Error saat mencoba mendaftar ke acara berbayar, tetapi tidak ada log error di terminal backend. Di mana letak kesalahannya?"
- **Dampak**: AI membantu mengidentifikasi bahwa crash terjadi sebelum blok `try...catch`. Solusi yang diberikan berhasil menangkap error yang sebenarnya dan mempercepat proses perbaikan bug

### Refactoring & Implementasi Fitur Kompleks
- **Prompt**: "Saya ingin mengubah logika 'Organizer Teratas' agar menampilkan 5 organizer dengan acara terbanyak. Berikan saya kode aggregation pipeline MongoDB untuk ini."
- **Dampak**: AI menyediakan kode aggregation pipeline yang kompleks, memungkinkan implementasi fitur canggih tanpa perlu riset manual yang memakan waktu

### Konversi Sintaks & Konfigurasi
- **Prompt**: "Saya mengalami error ERR_REQUIRE_ESM. Bantu saya mengubah seluruh file backend dari CommonJS (require) menjadi ES Modules (import/export)."
- **Dampak**: AI memberikan panduan dan contoh kode yang jelas untuk setiap file, menyederhanakan proses migrasi yang rumit

### Desain & UI/UX
- **Prompt**: "Saya ingin mengubah halaman login saya yang menggunakan HTML biasa menjadi lebih modern menggunakan library MUI. Berikan kode lengkap untuk LoginPage.jsx."
- **Dampak**: AI membantu mempercepat proses refactoring UI dengan menyediakan kode komponen MUI yang sudah jadi, lengkap dengan layout dan styling yang sesuai praktik terbaik

### Kesimpulan
Secara keseluruhan, AI berfungsi sebagai pair programmer yang mempercepat iterasi, memberikan solusi untuk masalah teknis yang kompleks, dan membantu menerapkan praktik terbaik dalam penulisan kode.

### Dokumentasi Website
<img width="1897" height="870" alt="image" src="https://github.com/user-attachments/assets/32f5b710-f6a1-4a72-8a99-29a99d3249b4" />
<img width="1898" height="870" alt="image" src="https://github.com/user-attachments/assets/5afcb7bc-8880-4e58-af95-11867a428cf7" />
<img width="1899" height="970" alt="image" src="https://github.com/user-attachments/assets/2ed46ba2-23fc-4800-b104-ff5e893629ba" />
<img width="1915" height="868" alt="image" src="https://github.com/user-attachments/assets/f8ca48dc-7ac3-49b1-9190-51ba50d17f31" />

### Dokumentasi Penggunaan AI
<img width="1919" height="869" alt="Screenshot 2025-07-14 080313" src="https://github.com/user-attachments/assets/1d33b7e1-cc45-4203-bb0c-12578e143e99" />
<img width="1919" height="930" alt="Screenshot 2025-07-14 105409" src="https://github.com/user-attachments/assets/11997f19-f285-4104-9c74-51ef67ea0413" />




# VL STUDIO — Website + Owner Panel

Website statis responsif dengan gaya Dark Premium dan Firebase sebagai backend.

## Fitur
- Halaman publik: HOME, MAP, STORE, TEAM, SUPPORT.
- Owner login menggunakan Firebase Authentication (email + password).
- Dashboard owner untuk tambah/edit/hapus map, produk/jasa, anggota team, dan tautan support.
- Upload gambar ke Firebase Storage (maksimum 8 MB per gambar).
- Data konten tersimpan di Cloud Firestore.
- Gambar ditampilkan mengikuti rasio aslinya secara proporsional pada kartu.

## 1. Buat proyek Firebase
1. Buka https://console.firebase.google.com/ lalu buat project baru bernama VL STUDIO.
2. Tambahkan Web App dari Project Overview.
3. Salin konfigurasi Firebase Web App.
4. Salin `public/firebase-config.js.example` menjadi `public/firebase-config.js`.
5. Isi nilai konfigurasi yang diberikan Firebase Console. Jangan isi password owner di file ini.

## 2. Siapkan login owner
1. Firebase Console → Authentication → Get started → Sign-in method.
2. Aktifkan Email/Password.
3. Authentication → Users → Add user.
4. Buat akun untuk email owner yang ditetapkan: `alifrizkyefendi@gmail.com`.
5. Buat kata sandi baru yang kuat dan unik. Jangan gunakan kata sandi yang pernah dibagikan di chat.
6. Buka detail akun dan pastikan email diverifikasi (gunakan alur verifikasi email Firebase bila tersedia).
7. Firestore Rules dan Storage Rules pada proyek ini hanya mengizinkan email owner tersebut yang sudah terverifikasi untuk menulis/menghapus data.

> Penting: Jangan pernah menaruh password di source code, HTML, JavaScript, GitHub, atau file konfigurasi frontend. Jika kata sandi yang pernah dikirim dalam percakapan masih digunakan di layanan lain, ganti juga di layanan tersebut.

## 3. Aktifkan database dan storage
1. Firebase Console → Firestore Database → Create database.
2. Firebase Console → Storage → Get started.
3. Pilih lokasi database/storage yang sesuai dan konsisten.
4. Deploy rules dari folder proyek menggunakan Firebase CLI (langkah di bawah).

## 4. Deploy
Pasang Node.js LTS dan Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
```
Di folder proyek:
```bash
firebase use --add
```
Pilih project VL STUDIO. Lalu deploy:
```bash
firebase deploy
```
Firebase akan memberikan URL hosting. Buka URL itu untuk melihat website.

## 5. Menggunakan Owner Panel
1. Buka website → klik `OWNER LOGIN`.
2. Masuk dengan akun owner Firebase.
3. Dashboard akan muncul. Gunakan menu Manage Maps, Manage Store, Manage Team, Support Links, dan Home Content.
4. Tambahkan data pertama. Konten yang disimpan akan tampil otomatis di website publik.

## Struktur konten
- `maps`: title, category, description, link, imageUrl, imagePath.
- `products`: title, category, description, price, link, imageUrl, imagePath.
- `team`: name, role.
- `support`: title, link.
- `settings/home`: headline, description.

## Catatan penting sebelum dipublikasikan
- Firebase web config bukan rahasia; Firebase Rules dan Authentication adalah pengaman utama.
- Jangan pernah mengubah Rules menjadi `allow read, write: if true`.
- Tambahkan domain hosting ke Authentication → Settings → Authorized domains jika diperlukan.
- Tautan map, pembayaran, donasi, komunitas, dan pemesanan harus diuji satu per satu.
- Transaksi Robux harus mengikuti ketentuan dan mekanisme resmi Roblox.
- Website ini adalah starter yang siap dikonfigurasi dan deploy. Firebase project, akun owner, domain, dan konten nyata tetap perlu disiapkan oleh pemilik.

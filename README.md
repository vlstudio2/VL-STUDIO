# VL STUDIO Website Starter

Website starter Next.js dengan tema Dark Modern untuk promosi map, katalog store, team, support, dan kerangka dashboard Owner.

## Jalankan lokal
1. Install Node.js versi LTS.
2. Extract project, buka folder `vl-studio`.
3. Jalankan `npm install`.
4. Salin `.env.example` menjadi `.env.local`.
5. Jalankan `npm run dev`, lalu buka http://localhost:3000.

## Sebelum online
- Buat project Supabase dan isi environment variables.
- Buat akun Owner di Supabase Auth dengan email `alifrizkyefendi@gmail.com`.
- Gunakan password/PIN kuat. Jangan menaruh PIN di source code atau membagikannya.
- Aktifkan verifikasi email dan batasi dashboard/API hanya untuk email Owner.
- Buat tabel dan Storage bucket, aktifkan Row Level Security (RLS), dan tulis policy berdasarkan user terautentikasi + allowlist Owner.
- Hubungkan upload gambar ke Supabase Storage dan CRUD map/store/team ke database.
- Hubungkan Midtrans Snap/Payment API di server. Verifikasi signature webhook di server sebelum mengubah status pesanan menjadi paid.
- Deploy ke Vercel, lalu hubungkan domain yang sudah dibeli melalui pengaturan DNS.

## Catatan penting
File ini adalah starter UI yang bisa dijalankan dan dikembangkan. Dashboard admin saat ini berupa kerangka visual; autentikasi, penyimpanan data, upload, checkout, dan webhook belum diaktifkan. Jangan menerima pembayaran sungguhan sebelum integrasi server dan pengujian selesai.

## Pembayaran
Gunakan akun merchant Midtrans milik Owner. Jangan pernah mengekspos `MIDTRANS_SERVER_KEY` atau `SUPABASE_SERVICE_ROLE_KEY` ke browser. Untuk produk digital/Robux, pastikan penjualan dan pemenuhan pesanan mematuhi ketentuan Roblox serta kebijakan payment gateway.

# Platform Identitas Digital Terpadu DPUPR Kabupaten Garut (PUPR-ID)

## 1. Visi Sistem
Mewujudkan **Platform Identitas Digital Terpadu DPUPR Kabupaten Garut** yang aman, modern, terintegrasi, dan berbasis *Zero Trust Security* untuk seluruh aplikasi internal maupun layanan publik. Dengan sistem ini, setiap pegawai, administrator, konsultan, penyedia jasa, OPD terkait, dan masyarakat cukup memiliki **satu akun (Single Sign-On / SSO)** untuk mengakses seluruh layanan digital.

## 2. Nama Sistem
Alternatif nama yang sedang dipertimbangkan:
- **Garut Identity**
- **GARUDA ID** (Garut Unified Digital Authentication)
- **PUPR ID**
- **SI-ID DPUPR**

## 3. Tujuan Utama
- Menghilangkan banyaknya akun duplikat.
- Mengurangi kebutuhan mengingat password yang berbeda-beda.
- Mempermudah administrasi dan manajemen pengguna.
- Memusatkan keamanan akun di satu titik.
- Mendukung *Smart Government* dan Sistem Pemerintahan Berbasis Elektronik (SPBE).
- Mendukung kemudahan integrasi lintas aplikasi.

## 4. Arsitektur Sistem
Sistem ini menggunakan arsitektur *Zero Trust* dengan lapisan berikut:
1. **Load Balancer:** Mengatur *traffic* dan memastikan *High Availability*.
2. **SSO Gateway:** Menangani protokol OAuth2, OIDC, dan SAML.
3. **Identity Server:** Menggunakan **Keycloak** untuk autentikasi terpusat.
4. **MFA Authentication:** Lapisan tambahan berupa OTP, TOTP, dan FIDO2.
5. **User Directory:** Penyimpanan data pengguna menggunakan PostgreSQL (dan LDAP jika diperlukan).

## 5. Standar Autentikasi yang Diterapkan
- **OAuth 2.1:** Untuk *Authorization*.
- **OpenID Connect (OIDC):** Untuk *Authentication*.
- **JWT:** Sebagai *Access Token*.
- **Refresh Token:** Untuk sesi login yang berkelanjutan dan aman.
- **PKCE:** Keamanan tambahan untuk aplikasi *Mobile/Single Page App (SPA)*.
- **SAML 2.0:** Untuk keperluan integrasi antar instansi pemerintah.
- **SCIM:** Untuk sinkronisasi data pengguna lintas platform.
- **WebAuthn:** Standar autentikasi tanpa kata sandi (*Passwordless*).

## 6. Jenis Pengguna dan RBAC (Role Based Access Control)
Hierarki role yang akan diimplementasikan:
1. Super Admin
2. Administrator
3. Kepala Dinas
4. Kabid (Kepala Bidang)
5. Kasi (Kepala Seksi)
6. Operator
7. Surveyor
8. Guest (Masyarakat / Konsultan / OPD Lain)

## 7. Lifecycle Akun
```
Create User → Verifikasi → Aktivasi → Login → MFA → Session → Logout (Atau Suspend/Delete)
```

## 8. Multi Factor Authentication (MFA)
Metode autentikasi yang didukung secara bertahap:
- Username & Password
- Email & SMS OTP
- Google/Microsoft Authenticator (TOTP)
- Face Recognition & Fingerprint (Biometrik)
- Passkey (WebAuthn)
- Smart Card & NFC

## 9. Integrasi Aplikasi
Semua aplikasi di lingkungan DPUPR cukup menggunakan tombol **"Login dengan DPUPR ID"**.
Aplikasi yang akan diintegrasikan meliputi: SIMBG, SIJENANG, SI-ABANG, LAIKA, GIS, Dashboard Pimpinan, dll.

## 10. Dashboard Administrator dan Executive
- **Statistik & Audit:** Melihat jumlah pengguna, aktivitas login, upaya login gagal, pengguna per aplikasi, dll.
- **Audit Trail:** Mencatat log aktivitas kritikal (Login, Reset Password, Ubah Akses, dll).
- **Executive View:** Memantau adopsi SSO dan kepatuhan terhadap kebijakan keamanan.

## 11. Teknologi yang Digunakan (Tech Stack)
- **Frontend:** React, Next.js, Tailwind CSS, TypeScript, Shadcn UI.
- **Backend (Gateway/API):** Java (Spring Boot) / Python (FastAPI).
- **Identity Provider (IdP):** Keycloak.
- **Database & Cache:** PostgreSQL dan Redis.
- **Infrastruktur:** Docker, Kubernetes, Nginx/Traefik, Prometheus, Grafana, Loki.

## 12. Roadmap Implementasi
1. Analisis Kebutuhan & Penyusunan Arsitektur (2 Minggu).
2. Implementasi Keycloak & Infrastruktur (3 Minggu).
3. Integrasi Aplikasi Prioritas (4 Minggu).
4. Penerapan MFA & Kebijakan Keamanan (2 Minggu).
5. Migrasi Akun Pengguna (2 Minggu).
6. Uji Keamanan (Pen-Test) & UAT (3 Minggu).
7. Implementasi Penuh & Pelatihan (2 Minggu).

---
*Dokumen ini merupakan panduan konseptual utama dalam pengembangan sistem SSO DPUPR Kabupaten Garut. Seluruh tim pengembang (termasuk AI) wajib merujuk pada dokumen ini dan panduan teknis yang berada di direktori `.agents/`.*

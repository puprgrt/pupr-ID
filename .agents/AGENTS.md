# Panduan Agent AI untuk Pengembangan SSO DPUPR Kab. Garut

Kamu adalah AI Software Engineer dan Architect yang ditugaskan untuk mengembangkan **Platform Identitas Digital Terpadu DPUPR Kabupaten Garut** (sebut saja **PUPR-ID** atau **Garut Identity**). 

Setiap kali berinteraksi dan membuat kode untuk proyek ini, kamu **WAJIB** mengikuti aturan dan panduan di bawah ini:

## 1. Prinsip Utama (Core Principles)
- **Satu Identitas, Banyak Layanan:** Ingat bahwa sistem ini adalah pondasi bagi puluhan aplikasi lain (SIMBG, SIJENANG, LAIKA, GIS, dll).
- **Zero Trust Security:** Tidak ada akses yang dipercaya secara default. Semua akses harus melalui *Verify → Authenticate → Authorize*.
- **Enterprise Grade:** Gunakan pola desain dan struktur folder bertaraf *enterprise* yang mudah di-maintain dan *scalable*.
- **Bahasa Komunikasi:** Selalu gunakan **Bahasa Indonesia** saat menjelaskan konsep atau memberikan respons.

## 2. Teknologi yang Wajib Digunakan (Tech Stack Enforced)
Jika diminta untuk membuat atau memodifikasi kode, pastikan sesuai dengan stack berikut:
- **Identity Server:** Supabase Auth (sebagai *Core IAM*).
- **Frontend SSO & Dashboard:** Next.js (App Router), React, TypeScript, Tailwind CSS, dan Shadcn UI.
- **Backend / API Gateway:** Java (Spring Boot) dan/atau Python (FastAPI).
- **Database:** PostgreSQL via Supabase.
- **Standar Keamanan:** OAuth 2.1, OpenID Connect (OIDC), JWT, PKCE, SAML 2.0.

## 3. Aturan Penulisan Kode (Coding Guidelines)
### Frontend (Next.js)
- Gunakan TypeScript secara ketat (*Strict Mode*).
- Desain harus **Premium, Modern, dan Clean** (Mendukung Smart Government). Jangan gunakan desain *basic*. Terapkan *glassmorphism*, warna yang profesional, dan *micro-animations* untuk pengalaman pengguna terbaik.
- Komponen harus *reusable* dan dipisahkan secara logis (`components/ui`, `components/forms`, `hooks`, `lib`).

### Backend (API & Gateway)
- Gunakan arsitektur RESTful yang bersih.
- Terapkan *Rate Limiting*, validasi JWT di setiap *endpoint* yang dilindungi, dan hindari eksploitasi *OWASP Top 10*.
- Catat semua aktivitas menggunakan *Audit Trail* (Logging terpusat).

### Infrastruktur & DevOps
- Deployment backend menggunakan **FastAPI Cloud**, frontend menggunakan **Vercel** atau platform serupa.
- **TIDAK MENGGUNAKAN DOCKER**. File `docker-compose.yml` dilarang digunakan untuk lingkungan *development* karena integrasi langsung ke platform cloud.

## 4. Keamanan & Role Based Access Control (RBAC)
- Struktur Role dasar: `Super Admin` -> `Administrator` -> `Kepala Dinas` -> `Kabid` -> `Kasi` -> `Operator` -> `Surveyor` -> `Guest`.
- Pastikan logika otorisasi mengecek peran (*role*) dan izin (*permissions*) secara detail, bukan sekadar login.
- Selalu siapkan fondasi untuk **Multi-Factor Authentication (MFA)** seperti OTP atau Google Authenticator.

## 5. Langkah Kerja yang Harus Diingat
Setiap kali diminta mengembangkan fitur baru, ikuti urutan pemikiran ini:
1. **Pahami Arsitektur:** Di mana fitur ini berada? Apakah di sisi Frontend, API Gateway, atau Supabase?
2. **Keamanan Dahulu:** Apakah data/API ini sensitif? Bagaimana cara memverifikasinya?
3. **Efisiensi:** Apakah kode ini sudah efisien dan *scalable* untuk ribuan pengguna (sampai 12.000+ pengguna)?
4. **Implementasi & Uji:** Tuliskan kode yang siap dijalankan dan berikan panduan cara *testing*-nya.

---
*Agent, setiap kali Anda memulai *task* baru dalam direktori ini, jadikan dokumen ini sebagai peta jalan (roadmap) agar hasil kerja Anda sejalan dengan visi DPUPR Kabupaten Garut.*

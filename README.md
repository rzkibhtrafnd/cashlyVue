# Cashly - Aplikasi Kasir & Manajemen Keuangan

![Cashly Banner](banner.png)

**Cashly** adalah aplikasi kasir modern dan dashboard keuangan yang dibangun dengan **Vue 3 + TypeScript + Tailwind CSS**. Dirancang untuk UMKM, toko retail, dan bisnis yang membutuhkan sistem kasir yang cepat, cantik, dan mudah digunakan.

## ✨ Fitur Utama

- **Dua Role Dashboard**
  - **Kasir Dashboard** — Transaksi cepat, keranjang belanja, struk
  - **Admin Dashboard** — Laporan penjualan, manajemen produk, analitik

- **Manajemen Transaksi**
- **Laporan & Grafik** (ApexCharts)
- **Dark Mode** support
- **Responsive** di semua device
- **Multi User Role** (Admin & Kasir)

## 🛠️ Tech Stack

- **Frontend**: Vue 3 (Composition API + Script Setup)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **UI Components**: Custom + Lucide Icons

## 🚀 Cara Install

### Prerequisites
- Node.js 20+
- npm atau yarn

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/rzkibhtrafnd/cashlyVue.git
cd cashlyVue

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env sesuai konfigurasi Anda

# 4. Jalankan development server
npm run dev
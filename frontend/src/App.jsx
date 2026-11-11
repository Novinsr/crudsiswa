import { useEffect, useState, useMemo } from 'react';
import { api } from './api';
import SiswaTable from './components/SiswaTable.jsx';
import SiswaForm from './components/SiswaForm.jsx';
import LogoSekolah from './components/LogoSekolah.jsx';

export default function App() {
  const [siswa, setSiswa] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formAwal, setFormAwal] = useState(null); // null = tertutup, {} = tambah, objek = ubah
  const [pesan, setPesan] = useState('');

  async function muat(kata = q) {
    try {
      setError('');
      setSiswa(await api.list(kata));
    } catch (e) {
      setError('Gagal memuat data. Pastikan server backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  }

  // Muat ulang saat kata kunci berubah (dengan debounce)
  useEffect(() => {
    const t = setTimeout(() => muat(q), 200);
    return () => clearTimeout(t);
  }, [q]);

  function tampilkanPesan(teks) {
    setPesan(teks);
    setTimeout(() => setPesan(''), 3000);
  }

  async function simpan(data) {
    if (formAwal?.id) {
      await api.update(formAwal.id, data);
      tampilkanPesan('Data siswa berhasil diperbarui.');
    } else {
      await api.create(data);
      tampilkanPesan('Siswa baru berhasil ditambahkan.');
    }
    setFormAwal(null);
    muat();
  }

  async function hapus(s) {
    if (!window.confirm(`Hapus data ${s.nama}? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await api.remove(s.id);
      tampilkanPesan('Data siswa telah dihapus.');
      muat();
    } catch (e) {
      setError(e.message);
    }
  }

  // Menghitung statistik jurusan unik
  const totalJurusan = useMemo(() => {
    const jurusanSet = new Set(siswa.map((s) => s.jurusan).filter(Boolean));
    return jurusanSet.size;
  }, [siswa]);

  return (
    <div className="halaman-bungkus">
      <div className="halaman">
        {/* Header Utama */}
        <header className="kepala">
          <div className="judul-wrapper">
            <LogoSekolah />
            <div className="judul-teks">
              <h1>Data Siswa</h1>
              <p className="sub">Sistem Manajemen & Informasi Data Siswa</p>
            </div>
          </div>
          <button className="tombol tombol-utama tombol-tambah" onClick={() => setFormAwal({})}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Tambah Siswa</span>
          </button>
        </header>

        {/* Ringkasan Statistik Singkat */}
        <div className="kartu-statistik-grup">
          <div className="kartu-stat">
            <div className="stat-icon stat-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="stat-angka">{siswa.length}</div>
              <div className="stat-label">Total Siswa</div>
            </div>
          </div>

          <div className="kartu-stat">
            <div className="stat-icon stat-indigo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <div className="stat-angka">{totalJurusan}</div>
              <div className="stat-label">Jurusan Terdata</div>
            </div>
          </div>
        </div>

        {/* Bar Pencarian */}
        <div className="pencarian-wrapper">
          <div className="pencarian-inner">
            <svg className="icon-cari" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="input-cari"
              type="text"
              placeholder="Cari berdasarkan nama, NIS, jurusan, atau alamat…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari siswa"
            />
            {q && (
              <button
                type="button"
                className="tombol-clear"
                onClick={() => setQ('')}
                aria-label="Hapus pencarian"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="banner-galat" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Tampilan Tabel atau Status Kosong */}
        {loading ? (
          <div className="kartu-status kosong">
            <div className="spinner besar" />
            <p>Memuat data siswa…</p>
          </div>
        ) : siswa.length === 0 ? (
          <div className="kartu-status kosong">
            <div className="kosong-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h3>{q ? 'Tidak ada hasil yang cocok' : 'Belum ada data siswa'}</h3>
            <p>
              {q
                ? `Tidak ditemukan siswa dengan kata kunci “${q}”. Coba kata kunci lainnya.`
                : 'Mulai kelola data sekolah dengan menambahkan siswa pertama Anda sekarang.'}
            </p>
            {!q && (
              <button className="tombol tombol-utama" onClick={() => setFormAwal({})}>
                + Tambah Siswa Pertama
              </button>
            )}
          </div>
        ) : (
          <SiswaTable data={siswa} onUbah={setFormAwal} onHapus={hapus} />
        )}

        {/* Modal Form Tambah / Ubah */}
        {formAwal && (
          <SiswaForm
            awal={formAwal}
            onSimpan={simpan}
            onBatal={() => setFormAwal(null)}
          />
        )}

        {/* Toast Notifikasi */}
        {pesan && (
          <div className="toast-notif" role="status">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{pesan}</span>
          </div>
        )}
      </div>
    </div>
  );
}

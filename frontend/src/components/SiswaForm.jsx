import { useState } from 'react';

const KOSONG = {
  nis: '',
  nama: '',
  jurusan: '',
  tanggal_lahir: '',
  alamat: '',
};

export default function SiswaForm({ awal, onSimpan, onBatal }) {
  const ubah = Boolean(awal.id);
  const [v, setV] = useState({
    ...KOSONG,
    ...Object.fromEntries(Object.entries(awal).map(([k, val]) => [k, val ?? ''])),
  });
  const [galat, setGalat] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function kirim(e) {
    e.preventDefault();
    setGalat('');
    setMenyimpan(true);
    try {
      await onSimpan(v);
    } catch (err) {
      setGalat(err.message);
      setMenyimpan(false);
    }
  }

  return (
    <div className="latar" onMouseDown={(e) => e.target === e.currentTarget && onBatal()}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon">
              {ubah ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              )}
            </div>
            <div>
              <h2>{ubah ? 'Ubah Data Siswa' : 'Tambah Siswa Baru'}</h2>
              <p className="modal-sub">
                {ubah ? 'Perbarui rincian data siswa di bawah ini' : 'Masukkan rincian data siswa di bawah ini'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="tombol-tutup"
            onClick={onBatal}
            aria-label="Tutup form"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={kirim}>
          <div className="baris-input">
            <div className="grup-input">
              <label htmlFor="nis">
                NIS <span className="wajib">*</span>
              </label>
              <input
                id="nis"
                value={v.nis}
                onChange={set('nis')}
                placeholder="Contoh: 10245"
                required
                autoFocus
              />
            </div>
            <div className="grup-input">
              <label htmlFor="jurusan">
                Jurusan <span className="wajib">*</span>
              </label>
              <input
                id="jurusan"
                value={v.jurusan}
                onChange={set('jurusan')}
                placeholder="Contoh: RPL, TKJ, IPA"
                required
              />
            </div>
          </div>

          <div className="grup-input">
            <label htmlFor="nama">
              Nama Lengkap <span className="wajib">*</span>
            </label>
            <input
              id="nama"
              value={v.nama}
              onChange={set('nama')}
              placeholder="Contoh: Muhammad Rizki"
              required
            />
          </div>

          <div className="grup-input">
            <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
            <input
              id="tanggal_lahir"
              type="date"
              value={v.tanggal_lahir}
              onChange={set('tanggal_lahir')}
            />
          </div>

          <div className="grup-input">
            <label htmlFor="alamat">Alamat Lengkap</label>
            <textarea
              id="alamat"
              rows="3"
              value={v.alamat}
              onChange={set('alamat')}
              placeholder="Contoh: Jl. Ahmad Yani No. 45, RT 02/RW 04"
            />
          </div>

          {galat && (
            <div className="galat" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{galat}</span>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="tombol tombol-sekunder" onClick={onBatal}>
              Batal
            </button>
            <button type="submit" className="tombol tombol-utama" disabled={menyimpan}>
              {menyimpan ? (
                <>
                  <span className="spinner" /> Menyimpan…
                </>
              ) : ubah ? (
                'Simpan Perubahan'
              ) : (
                'Tambah Siswa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

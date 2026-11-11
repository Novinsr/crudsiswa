function formatTanggal(t) {
  if (!t) return '—';
  const bagian = t.split('-');
  if (bagian.length !== 3) return t;
  const [y, m, d] = bagian;
  return `${d}/${m}/${y}`;
}

export default function SiswaTable({ data, onUbah, onHapus }) {
  return (
    <div className="tabel-card">
      <div className="tabel-bungkus">
        <table>
          <thead>
            <tr>
              <th style={{ width: '130px' }}>NIS</th>
              <th>Nama Siswa</th>
              <th style={{ width: '160px' }}>Jurusan</th>
              <th style={{ width: '130px' }}>Tgl. Lahir</th>
              <th>Alamat</th>
              <th style={{ width: '150px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id}>
                <td>
                  <span className="badge-nis">{s.nis}</span>
                </td>
                <td>
                  <span className="nama-utama">{s.nama}</span>
                </td>
                <td>
                  <span className="badge-jurusan">{s.jurusan}</span>
                </td>
                <td>
                  <span className="teks-tanggal">{formatTanggal(s.tanggal_lahir)}</span>
                </td>
                <td>
                  {s.alamat ? (
                    <span className="teks-alamat" title={s.alamat}>
                      {s.alamat}
                    </span>
                  ) : (
                    <span className="teks-kosong">—</span>
                  )}
                </td>
                <td className="aksi">
                  <div className="aksi-grup">
                    <button
                      type="button"
                      className="tombol-aksi ubah"
                      onClick={() => onUbah(s)}
                      title="Ubah data"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                      <span>Ubah</span>
                    </button>
                    <button
                      type="button"
                      className="tombol-aksi hapus"
                      onClick={() => onHapus(s)}
                      title="Hapus data"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Validasi input; mengembalikan { data } atau { error }
function validasi(body) {
  const data = {
    nis: String(body.nis ?? '').trim(),
    nama: String(body.nama ?? '').trim(),
    kelas: String(body.kelas ?? '').trim(),
    jenis_kelamin: String(body.jenis_kelamin ?? '').trim(),
    agama: String(body.agama ?? '').trim() || null,
    hobi: String(body.hobi ?? '').trim() || null,
    tanggal_lahir: String(body.tanggal_lahir ?? '').trim() || null,
    alamat: String(body.alamat ?? '').trim() || null,
    no_hp: String(body.no_hp ?? '').trim() || null,
  };

  if (!data.nis) return { error: 'NIS wajib diisi.' };
  if (!data.nama) return { error: 'Nama wajib diisi.' };
  if (!data.kelas) return { error: 'Kelas wajib diisi.' };
  if (!['L', 'P'].includes(data.jenis_kelamin)) {
    return { error: 'Jenis kelamin harus L atau P.' };
  }
  return { data };
}

function tanganiError(err, res) {
  if (/UNIQUE constraint failed/i.test(err.message)) {
    return res.status(409).json({ message: 'NIS sudah terdaftar.' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}

// READ: semua siswa (opsional pencarian ?q=)
app.get('/api/siswa', (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const rows = q
    ? db
      .prepare(
        `SELECT * FROM siswa
           WHERE nama LIKE @q OR nis LIKE @q OR kelas LIKE @q OR agama LIKE @q OR hobi LIKE @q
           ORDER BY nama COLLATE NOCASE`
      )
      .all({ q: `%${q}%` })
    : db.prepare('SELECT * FROM siswa ORDER BY nama COLLATE NOCASE').all();
  res.json(rows);
});

// READ: satu siswa
app.get('/api/siswa/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM siswa WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
  res.json(row);
});

// CREATE
app.post('/api/siswa', (req, res) => {
  const { data, error } = validasi(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const info = db
      .prepare(
        `INSERT INTO siswa (nis, nama, kelas, jenis_kelamin, agama, hobi, tanggal_lahir, alamat, no_hp)
         VALUES (@nis, @nama, @kelas, @jenis_kelamin, @agama, @hobi, @tanggal_lahir, @alamat, @no_hp)`
      )
      .run(data);
    const row = db.prepare('SELECT * FROM siswa WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(row);
  } catch (err) {
    tanganiError(err, res);
  }
});

// UPDATE
app.put('/api/siswa/:id', (req, res) => {
  const { data, error } = validasi(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const info = db
      .prepare(
        `UPDATE siswa SET nis=@nis, nama=@nama, kelas=@kelas, jenis_kelamin=@jenis_kelamin,
           agama=@agama, hobi=@hobi, tanggal_lahir=@tanggal_lahir, alamat=@alamat, no_hp=@no_hp
         WHERE id=@id`
      )
      .run({ ...data, id: req.params.id });
    if (info.changes === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
    }
    res.json(db.prepare('SELECT * FROM siswa WHERE id = ?').get(req.params.id));
  } catch (err) {
    tanganiError(err, res);
  }
});

// DELETE
app.delete('/api/siswa/:id', (req, res) => {
  const info = db.prepare('DELETE FROM siswa WHERE id = ?').run(req.params.id);
  if (info.changes === 0) {
    return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API berjalan di http://localhost:${PORT}`);
});

// SQLite bawaan Node.js (butuh Node 22.5+), tidak perlu install paket tambahan.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'siswa.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS siswa (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    nis            TEXT NOT NULL UNIQUE,
    nama           TEXT NOT NULL,
    kelas          TEXT NOT NULL,
    jenis_kelamin  TEXT NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
    agama          TEXT,
    hobi           TEXT,
    tanggal_lahir  TEXT,
    alamat         TEXT,
    no_hp          TEXT,
    created_at     TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

// Migrasi kolom jika tabel sudah ada sebelumnya
const columns = db.prepare('PRAGMA table_info(siswa)').all().map((c) => c.name);
if (!columns.includes('agama')) {
  db.exec('ALTER TABLE siswa ADD COLUMN agama TEXT');
}
if (!columns.includes('hobi')) {
  db.exec('ALTER TABLE siswa ADD COLUMN hobi TEXT');
}

module.exports = db;

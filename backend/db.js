// SQLite bawaan Node.js (butuh Node 22.5+), tidak perlu install paket tambahan.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'siswa.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS siswa (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    nis            TEXT NOT NULL UNIQUE,
    nama           TEXT NOT NULL,
    jurusan        TEXT NOT NULL,
    tanggal_lahir  TEXT,
    alamat         TEXT,
    created_at     TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

// Migrasi kolom jika ada perubahan dari versi sebelumnya
const columns = db.prepare('PRAGMA table_info(siswa)').all().map((c) => c.name);
if (columns.includes('kelas') && !columns.includes('jurusan')) {
  db.exec('ALTER TABLE siswa RENAME COLUMN kelas TO jurusan');
}
if (!columns.includes('tanggal_lahir')) {
  db.exec('ALTER TABLE siswa ADD COLUMN tanggal_lahir TEXT');
}

module.exports = db;

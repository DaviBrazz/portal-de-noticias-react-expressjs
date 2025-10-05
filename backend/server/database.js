const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS noticias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      image BLOB,
      date TEXT
    )
  `);
});

// Criar notícia
function criarNoticia(title, description, imageBuffer, date) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO noticias (title, description, image, date) VALUES (?, ?, ?, ?)',
      [title, description, imageBuffer, date],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

// Listar notícias (sem BLOB)
function listarNoticias() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, title, description, date FROM noticias ORDER BY date DESC', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Buscar notícia pelo ID
function buscarNoticiaPorId(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM noticias WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Editar notícia (PATCH)
function editarNoticia(id, title, description, imageBuffer) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE noticias SET title = ?, description = ?, image = ? WHERE id = ?',
      [title, description, imageBuffer, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0); // true se alguma linha foi alterada
      }
    );
  });
}

// Deletar notícia
function deletarNoticia(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM noticias WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0); // true se alguma linha foi deletada
    });
  });
}

module.exports = {
  criarNoticia,
  listarNoticias,
  buscarNoticiaPorId,
  editarNoticia,
  deletarNoticia
};

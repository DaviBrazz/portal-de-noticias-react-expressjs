const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

// Criar tabela de notícias (caso não exista)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS noticias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            image TEXT,         -- Novo campo para URL da image
            date TEXT
        )
    `);
});


function criarNoticia(title, description, image, dataCriacao) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO noticias (title, description, image, date) VALUES (?, ?, ?, ?)',
            [title, description, image, dataCriacao],
            function (err) {
                if (err) reject(err);
                resolve({ id: this.lastID });
            }
        );
    });
}


async function listarNoticias() {
    try {
        const result = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM noticias ORDER BY date DESC', [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        if (result.length === 0) {
            return 'Sem notícias cadastradas';
        }

        return result;
    } catch (error) {
        throw error;
    }
}


async function editarNoticia(id, title, description, image) {
    const result = await db.run(
        'UPDATE noticias SET title = ?, description = ?, image = ? WHERE id = ?',
        [title, description, image, id]
    );
    return result.affectedRows > 0;
}

async function deletarNoticia(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM noticias WHERE id = ?', [id], function(err) {
            if (err) return reject(err);
            resolve(this.changes > 0); 
        });
    });
}

module.exports = { criarNoticia, listarNoticias, editarNoticia, deletarNoticia };

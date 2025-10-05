const express = require('express');
const cors = require('cors');
const multer = require('multer');
const database = require('./database');

const app = express();
const PORTA = 5400;
const IP_SERVER = "http://localhost";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer em memória para upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Apenas imagens são permitidas"));
    cb(null, true);
  }
});

// Criar notícia
app.post('/noticias', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;
  const date = new Date().toISOString();

  if (!title || !description || !file) {
    return res.status(400).json({ message: "Título, descrição e imagem são obrigatórios" });
  }

  try {
    const result = await database.criarNoticia(title, description, file.buffer, date);
    res.status(201).json({ message: "Notícia criada com sucesso", id: result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar notícia" });
  }
});

// Listar notícias (sem BLOB)
app.get('/noticias', async (req, res) => {
  try {
    const noticias = await database.listarNoticias();
    const noticiasComUrl = noticias.map(n => ({
      ...n,
      image: `${IP_SERVER}:${PORTA}/noticias/imagem/${n.id}`
    }));
    res.json(noticiasComUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar notícias" });
  }
});

// Servir imagem via URL
app.get('/noticias/imagem/:id', async (req, res) => {
  try {
    const noticia = await database.buscarNoticiaPorId(req.params.id);
    if (!noticia || !noticia.image) return res.status(404).send("Imagem não encontrada");

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": noticia.image.length
    });
    res.end(noticia.image);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar imagem");
  }
});

// Atualizar notícia parcialmente (PATCH)
app.patch('/noticias/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const file = req.file;

  try {
    const noticia = await database.buscarNoticiaPorId(id);
    if (!noticia) return res.status(404).json({ message: "Notícia não encontrada" });

    // Atualiza apenas os campos fornecidos
    const novoTitle = title || noticia.title;
    const novaDescription = description || noticia.description;
    const novaImage = file ? file.buffer : noticia.image;

    await database.editarNoticia(id, novoTitle, novaDescription, novaImage);

    res.json({ message: "Notícia atualizada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar notícia" });
  }
});

// Deletar notícia
app.delete('/noticias/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await database.deletarNoticia(id);
    if (!result) return res.status(404).json({ message: "Notícia não encontrada" });

    res.json({ message: "Notícia deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar notícia" });
  }
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em ${IP_SERVER}:${PORTA}`);
});

const path = require('path');
const dotenv = require("dotenv")
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const express = require('express');
const cors = require('cors'); 
const database = require('./database');

const app = express();
const PORTA = process.env.PORTA || 5400;
const IP_SERVER = process.env.IP_SERVER;

app.use(cors()); 

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/noticias', async (req, res) => {
    const { title, description, image } = req.body;
    const date = new Date().toISOString();  

    if (!title || !description || !image) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios (title, description, image).' });
    }

    try {
        const result = await database.criarNoticia(title, description, image, date);
        return res.status(201).json({
            message: 'Notícia cadastrada com sucesso!',
            ID: res.id
        });
    } catch (error) {
        console.error('Erro ao cadastrar notícia:', error);
        return res.status(500).json({ message: 'Ocorreu um erro ao tentar cadastrar a notícia.' });
    }
});

app.get('/noticias', async (req, res) => {
    const noticias = await database.listarNoticias();
    res.json(noticias);
});

app.get('/noticias/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const noticia = await database.buscarNoticiaPorId(id); 

        if (noticia) {
            res.json(noticia);
        } else {
            res.status(404).json({ message: 'Notícia não encontrada.' });
        }
    } catch (error) {
        console.error('Erro ao buscar notícia:', error);
        res.status(500).json({ message: 'Ocorreu um erro ao tentar buscar a notícia.' });
    }
});

app.put('/noticias/:id', async (req, res) => {
    const { id } = req.params;  
    const { title, description, image } = req.body; 

    const result = await database.editarNoticia(id, title, description, image);

    if (result) {
        res.json({ message: 'Notícia atualizada com sucesso!' });
    } else {
        res.status(404).json({ message: 'Notícia não encontrada!' });
    }
});

app.delete('/noticias/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await database.deletarNoticia(id);

        if (result) {
            return res.json({ message: 'Notícia deletada com sucesso!' });
        } else {
            return res.status(404).json({ message: 'Notícia não encontrada.' });
        }
    } catch (error) {
        console.error('Erro ao deletar notícia:', error);
        return res.status(500).json({ message: 'Ocorreu um erro ao tentar deletar a notícia.' });
    }
});


app.listen(PORTA, () => {
    console.log(`Servidor rodando em ${IP_SERVER}:${PORTA}`);
});

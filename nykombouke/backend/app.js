import { get_Album, add_Album, delete_Album } from './dbconnector.js';
import express from 'express';

const app = express();
const port = 3001;

app.use(express.json({ limit: '10mb' })); // Økt limit for base64-bilder

app.get('/', (req, res) => {
    res.send('Hei velkommen til mitt musikkbiblotek! Legg til /musikk for å se alle albumene i databasen');
});

app.get('/musikk', async (req, res) => {
    console.log("Henter musikk fra databasen...");
    try {
        const data = await get_Album();
        res.json(data);
    } catch (error) {
        console.error("Feil ved henting av musikk:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/musikk', async (req, res) => {
    console.log("Legger til nytt album...", req.body?.tittel);
    try {
        const { tittel, artist_navn, utgivelsesaar, bilde_url, spotify_url, spotify_code_bilde } = req.body;
        if (!tittel || !artist_navn) {
            return res.status(400).json({ error: 'Tittel og artist er påkrevd' });
        }
        const result = await add_Album({ tittel, artist_navn, utgivelsesaar, bilde_url, spotify_url, spotify_code_bilde });
        res.status(201).json(result);
    } catch (error) {
        console.error("Feil ved lagring av album:", error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/musikk/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`Sletter album med id ${id}...`);
    try {
        await delete_Album(id);
        res.json({ success: true });
    } catch (error) {
        console.error("Feil ved sletting:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server kjører på port ${port}`);
});
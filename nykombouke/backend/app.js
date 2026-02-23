import { get_Album } from './dbconnector.js';
import express from 'express';

const app = express();
const port = 3001;

app.use(express.json());

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

app.listen(port, () => {
    console.log(`Server kjører på port ${port}`);
});
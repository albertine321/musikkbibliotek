import { get_Album } from './dbconnector.js';
import express from 'express';
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  /*   res.send('Hei velkommen til mitt musikkbiblotek! Legg til /musikk for å se alle albumene i databasen'); */
});

//TODO: Lag et nytt GET-endepunkt som henter alle spill
app.get('/musikk', async (req, res) => {
    console.log("Henter musikk fra databasen...");
    try {
        const data = await get_Album();
        res.json(data); // Bruk .json() i stedet for .send()
    } catch (error) {
        console.log("Feil ved henting av musikk");
        res.status(500).json({ error: error.message }); // Send en riktig feilmelding
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


//TODO: Lag et POST-endepunkt som legger til nye spill
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
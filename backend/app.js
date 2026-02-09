import { get_Album } from './dbconnector.js';
import express from 'express';
const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Hei velkommen til mitt spillbiblotek!');
});

//TODO: Lag et nytt GET-endepunkt som henter alle spill
app.get('/spill', async (req, res) => {

    console.log("Henter spill fra databasen...");
    try {
        const data = await get_Album();
        res.send(data);
    } catch (error) {
        console.log("Feil ved henting av spill");
        res.send(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


//TODO: Lag et POST-endepunkt som legger til nye spill

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
const express = require('express');
const app = express();
const port = 3001;
const database = require('./dbconnector.js');

app.get('/', (req, res) => {
  res.send('Hei velkommen til mitt spillbiblotek!');
});


//TODO: Lag et nytt GET-endepunkt som henter alle spill
app.get('/spill', async (req, res) => {
  let query = "SELECT * FROM games"

  try {
    let games = await database.query(query)

    res.send(games);
  } catch (error){
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
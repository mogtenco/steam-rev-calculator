const express = require('express');
const app = express();
const port = process.env.port || 5000;
const axios = require('axios');
const cors = require('cors');
const pulldata = require('./pulldata.js');
app.use(cors());
app.get("/gamedata", async (req, res) => {
    var data = await pulldata.GetGameData();
    res.json(data);
})

app.listen(port, err => {
    if (err)
        console.log(err);

    console.log(`Listening on port ${port}`);
})

//run once every x days
//StartInsertGames();


//StartInsertGameDetails();

//StartUpdateGameReviewCount();
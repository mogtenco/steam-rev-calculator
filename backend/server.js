const express = require('express');
const app = express();
const axios = require('axios');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'steam-revenue-calculator',
    password: 'sgw0o52s',
    port: 5432
});

var StartInsertGames = async () => {
    var steamGames = await GetAllGamesFromSteam();
    await InsertGamesIntoDB(steamGames);
}

//run once every x days
//StartInsertGames();

async function GetAllGamesFromSteam() {
    var results = await axios.get("https://api.steampowered.com/ISteamApps/GetAppList/v2/")
    return results.data.applist.apps;
}

async function InsertGamesIntoDB(steamGames) {
    for (var game of steamGames) {
        const text = 'INSERT INTO game(appid, name) VALUES($1, $2) ON CONFLICT (appid) DO NOTHING'
        const values = [game.appid, game.name]
        await pool.query(text, values, (err, res) => {
            if (err)
                console.log(err)
            else
                console.log(res)
        });
    }
}


var StartUpdateGameReviewCount = async () => {
    var gameList = await GetGameIDFromDB();
    var reviewCountList = await GetGameDetailsFromSteam(gameList);
    UpdateGameDetail(gameList, reviewCountList);
}

StartUpdateGameReviewCount();

//steam allow only max 100000 queries per day.
async function GetGameIDFromDB() {
    var result = await pool.query('SELECT * FROM game ORDER BY appid LIMIT 1000 OFFSET 0')
    return result.rows;
}
async function GetGameDetailsFromSteam(gameList) {
    console.log('accessing steam API...')
    var reviewCountList = []
    var counter = 0;
    for (var game of gameList) {
        await axios.get(`https://store.steampowered.com/appreviews/${game.appid}?json=1&language=all`)
            .then(res => {
                counter++;
                console.log(`retrieved ${game.name} (${counter}/${gameList.length})`)
                reviewCountList.push(res.data.query_summary.total_reviews);
            })
    }
    return reviewCountList;
}
async function UpdateGameDetail(gameList, reviewCountList) {
    for (let i = 0; i < gameList.length; i++) {
        var text = "UPDATE game SET total_reviews = $1 WHERE appid = $2";
        var value = [reviewCountList[i], gameList[i].appid];
        await pool.query(text, value, (err, res) => {
            if (err)
                console.log(err)
            else
                console.log(res);
        })
    }
}

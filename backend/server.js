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
//******************************************************** */
var StartInsertGameDetails = async () => {
    var gameList = await GetAllGamesIDFromDB();
    var gameDetailList = await GetGameDetailsFromSteam(gameList);
    UpdateGameDetails(gameList, gameDetailList);
}

StartInsertGameDetails();

//steam allow only max 100000 queries per day.
async function GetAllGamesIDFromDB() {
    var result = await pool.query('SELECT * FROM game ORDER BY appid LIMIT 5 OFFSET 0')
    return result.rows;
}
async function GetGameDetailsFromSteam(gameList) {
    console.log('accessing steam API...')
    var gameDetailList = []
    var counter = 0;
    for (var game of gameList) {
        var appid = game.appid;
        await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us`)
            .then(res => {
                counter++;
                console.log(`retrieved ${game.name} (${counter}/${gameList.length})`)
                gameDetailList.push(res.data[appid].data);
            })
    }
    return gameDetailList;
}

async function UpdateGameDetails(gameList, gameDetailList) {
    var counter = 0;
    for (let i = 0; i < gameList.length; i++) {
        var gameDetail = gameDetailList[i];
        var gameContainer = {
            appid: gameList[i].appid,
            type: gameDetail?.type || null,
            short_description: gameDetail?.short_description || null,
            supported_languages: gameDetail?.supported_languages || null,
            developers: gameDetail?.developers || null,
            publishers: gameDetail?.publishers || null,
            //categories: gameDetail?.categories || null,
            //genres: gameDetail?.genres || null,
            website: gameDetail?.website || null,
            metacritic_score: gameDetail?.metacritic?.score || null,
            release_date: gameDetail?.release_date?.date || null,
            platforms_windows: gameDetail?.platforms?.windows || false,
            platforms_mac: gameDetail?.platforms?.mac || false,
            platforms_linux: gameDetail?.platforms?.linux || false,
            initial_price: gameDetail?.price_overview?.initial || 0
        }
        counter++;
        console.log(`preparing to update: ${gameList[i].name} (${counter}/${gameList.length})`)

        var text = 'UPDATE game SET\
        type = $1,\
        short_description = $2,\
        supported_languages = $3,\
        publishers = $4,\
        developers = $5,\
        website = $6,\
        metacritic_score = $7,\
        release_date = $8,\
        platforms_windows = $9,\
        platforms_mac = $10,\
        platforms_linux = $11,\
        initial_price = $12\
        WHERE appid = $13';

        var value =
            [gameContainer.type,
            gameContainer.short_description,
            gameContainer.supported_languages,
            gameContainer.publishers,
            gameContainer.developers,
            gameContainer.website,
            gameContainer.metacritic_score,
            gameContainer.release_date,
            gameContainer.platforms_windows,
            gameContainer.platforms_mac,
            gameContainer.platforms_linux,
            gameContainer.initial_price,
            gameList[i].appid
            ];
        await pool.query(text, value, (err, res) => {
            if (err)
                console.log(err)
            else
                console.log(res);
        })
    }
}
//************************************************* */
var StartUpdateGameReviewCount = async () => {
    var gameList = await GetGameIDFromDB();
    var reviewCountList = await GetGameReviewCountFromSteam(gameList);
    UpdateGameReviewCount(gameList, reviewCountList);
}

//StartUpdateGameReviewCount();

//steam allow only max 100000 queries per day.
async function GetGameIDFromDB() {
    var result = await pool.query('SELECT * FROM game ORDER BY appid LIMIT 9000 OFFSET 1000')
    return result.rows;
}
async function GetGameReviewCountFromSteam(gameList) {
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
async function UpdateGameReviewCount(gameList, reviewCountList) {
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

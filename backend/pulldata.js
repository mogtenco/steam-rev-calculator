const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'steam-revenue-calculator',
    password: 'sgw0o52s',
    port: 5432
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
var pulldata = {/*INSERTING NEW GAMES*/
    waitInterval: async function () {
        await delay(2000);
    },
    StartInsertGames: async function () {
        var steamGames = await GetAllGamesFromSteam();
        await InsertGamesIntoDB(steamGames);
    },
    GetAllGamesFromSteam: async function () {
        var results = await axios.get("https://api.steampowered.com/ISteamApps/GetAppList/v2/")
        return results.data.applist.apps;
    },
    InsertGamesIntoDB: async function (steamGames) {
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
    },
    /*UPDATING GAME DETAILS*/
    StartInsertGameDetails: async function () {
        var gameList = await GetAllGamesIDFromDB();
        var gameDetailList = await GetGameDetailsFromSteam(gameList);

        UpdateGameDetails(gameList, gameDetailList);
    },
    GetAllGamesIDFromDB: async function () {
        var result = await pool.query('SELECT * FROM game ORDER BY appid LIMIT 1000 OFFSET 1000')
        return result.rows;
    },
    GetGameDetailsFromSteam: async function (gameList) {
        console.log('accessing steam API...')
        var gameDetailList = []
        var counter = 0;
        var appendRequest = '';
        for (var game of gameList) {
            var appid = game.appid;
            appendRequest += game.appid + ',';
        }
        appendRequest = appendRequest.slice(0, -1);
        await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appendRequest}&cc=us&filters=price_overview`)
            .then(res => {
                for (let i = 0; i < gameList.length; i++) {
                    gameDetailList.push(res.data[gameList[i].appid].data);
                }
            })

        return gameDetailList;
    },

    UpdateGameDetails: async function (gameList, gameDetailList) {
        var counter = 0;
        for (let i = 0; i < gameList.length; i++) {
            var gameDetail = gameDetailList[i];
            var gameContainer = {
                appid: gameList[i].appid,
                initial_price: gameDetail?.price_overview?.initial || 0
            }
            counter++;
            console.log(`preparing to update: ${gameList[i].name} (${counter}/${gameList.length})`)

            var text = 'UPDATE game SET\
            initial_price = $1\
            WHERE appid = $2';

            var value =
                [
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
    },
    /*UPDATING GAME REVIEW COUNTS*/
    StartUpdateGameReviewCount: async function () {
        var gameList = await GetGameIDFromDB();
        var reviewCountList = await GetGameReviewCountFromSteam(gameList);
        UpdateGameReviewCount(gameList, reviewCountList);
    },

    GetGameIDFromDB: async function () {
        var result = await pool.query('SELECT * FROM game ORDER BY appid LIMIT 9000 OFFSET 1000')
        return result.rows;
    },
    GetGameReviewCountFromSteam: async function (gameList) {
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
    },
    UpdateGameReviewCount: async function (gameList, reviewCountList) {
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
    },

    /*REST API FUNCTIONS*/
    GetGameData: async function () {
        var text = "SELECT * FROM game";
        try {
            var result = await pool.query(text);
            return result.rows;
        }
        catch (err) {
            console.log(err);
        }
    }
};
module.exports = pulldata;

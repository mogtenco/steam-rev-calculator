// async function UpdateGameDetails(gameList, gameDetailList) {
//     var counter = 0;
//     for (let i = 0; i < gameList.length; i++) {
//         var gameDetail = gameDetailList[i];
//         var gameContainer = {
//             appid: gameList[i].appid,
//             type: gameDetail?.type || null,
//             short_description: gameDetail?.short_description || null,
//             supported_languages: gameDetail?.supported_languages || null,
//             developers: gameDetail?.developers || null,
//             publishers: gameDetail?.publishers || null,
//             //categories: gameDetail?.categories || null,
//             //genres: gameDetail?.genres || null,
//             website: gameDetail?.website || null,
//             metacritic_score: gameDetail?.metacritic?.score || null,
//             release_date: gameDetail?.release_date?.date || null,
//             platforms_windows: gameDetail?.platforms?.windows || false,
//             platforms_mac: gameDetail?.platforms?.mac || false,
//             platforms_linux: gameDetail?.platforms?.linux || false,
//             initial_price: gameDetail?.price_overview?.initial || 0
//         }
//         counter++;
//         console.log(`preparing to update: ${gameList[i].name} (${counter}/${gameList.length})`)

//         var text = 'UPDATE game SET\
//         type = $1,\
//         short_description = $2,\
//         supported_languages = $3,\
//         publishers = $4,\
//         developers = $5,\
//         website = $6,\
//         metacritic_score = $7,\
//         release_date = $8,\
//         platforms_windows = $9,\
//         platforms_mac = $10,\
//         platforms_linux = $11,\
//         initial_price = $12\
//         WHERE appid = $13';

//         var value =
//             [gameContainer.type,
//             gameContainer.short_description,
//             gameContainer.supported_languages,
//             gameContainer.publishers,
//             gameContainer.developers,
//             gameContainer.website,
//             gameContainer.metacritic_score,
//             gameContainer.release_date,
//             gameContainer.platforms_windows,
//             gameContainer.platforms_mac,
//             gameContainer.platforms_linux,
//             gameContainer.initial_price,
//             gameList[i].appid
//             ];
//         await pool.query(text, value, (err, res) => {
//             if (err)
//                 console.log(err)
//             else
//                 console.log(res);
//         })
//     }
// }

// for (var game of gameList) {
//     var appid = game.appid;
//     // https://store.steampowered.com/api/appdetails?appids=438640,205100&cc=us&filters=price_overview
//     // await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us`)
//     //     .then(res => {
//     //         counter++;
//     //         console.log(`retrieved ${game.name} (${counter}/${gameList.length})`)
//     //         gameDetailList.push(res.data[appid].data);
//     //     })
//     appendRequest += game.appid + ',';
// }
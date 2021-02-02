const readChat = require("./chat");
const NotificationServer = require("./notificationServer");

console.log("Vinesauce Bad Joke Counter v. 2.M. The M stands for Morshu");

const server = new NotificationServer();

// const getStreamState = async () => {
//     const response = await fetch(`https://api.twitch.tv/helix/streams?user_id=${process.env.TWITCH_CHANNEL_ID}`, {
//         headers: { 
//             'Content-Type': 'application/json', 
//             'Authorization':`Bearer ${process.env.TWITCH_BEARER_TOKEN}`,
//             'client-id': process.env.TWITCH_CLIENT_ID
//         }
//     });
//     const json = await response.json();

//     return json.data != []
// }
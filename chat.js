const tmi = require("tmi.js");
const dotenv = require("dotenv");

dotenv.config();

function ReadChat(){
    const client = new tmi.Client({
        identity: {
            username: process.env.TWITCH_USERNAME,
            password: process.env.TWITCH_OAUTH
          },
          channels: [process.env.TWITCH_CHANNEL]
    });

    function onMessageHandler(target, context, msg, self){
        console.log(msg);
    }

   function onConnectedHandler (addr, port) {
        console.log(`Connected to ${addr}:${port}`);
   }

    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);

    client.connect();
}

module.exports = ReadChat;

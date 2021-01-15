const tmi = require("tmi.js");
const dotenv = require("dotenv");
// const EventEmitter = require('events');

dotenv.config();

// const ChatEvent = new events.EventEmitter();

function ReadChat(){
    const client = new tmi.Client({
        identity: {
            username: process.env.TWITCH_USERNAME,
            password: `oauth:${process.env.TWITCH_BEARER_TOKEN}`
          },
          channels: [process.env.TWITCH_CHANNEL]
    });

    function onMessageHandler(target, context, msg, self){
        console.log(msg);
    }

   function onConnectedHandler (addr, port) {
        console.log(`Connected to chat on ${addr}:${port}`);
   }

    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);

    client.connect();
}

module.exports = ReadChat;

const express = require("express");
const EventEmmiter = require("events");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const db = require('./database');

class NotificationServer{
    #server;

    constructor(){
        dotenv.config();

        this.NotificationEmiter = new EventEmmiter();
        this.#server = express();

        this.#ConfigureServer();
        this.#StartServer();
    }

    #ConfigureServer(){
        this.#server.get('/streamchanged', (req, res, next) => {
            res.set('Content-Type', 'text/plain');
            console.log("Sent challenge");
            return res.status(200).send(req.query["hub.challenge"]);
        });
        
        this.#server.post('/streamchanged', (req, res, next) => {
            console.log("Notification recieved!"); 
            console.log(req.body);
        
            return res.status(200).send();
        });
    }

    #StartServer(){
        this.#server.listen(process.env.PORT || 3000, async () => {
            // Check if the subscription to the twitch "Channel changes status" webhook has expired
            let query = (`SELECT subscription_expiration FROM streamers WHERE streamer_name = '${process.env.TWITCH_CHANNEL}'`);
            
            // If no result is returned or if expiration is 0, resubscribe
            try {
                let queryResult = await db.query(query)
                let {subscription_expiration} = queryResult[0]
    
                if(Date.now() > subscription_expiration || subscription_expiration == 0 || process.env.DEBUG){
                    console.log("Subscription has expired, resubscribing...");
                    this.#Subscribe();    
                }

                console.log("Started Notification Server!")
            } catch (error) {
                console.log(error.code);
            }
        });
    }

    #Subscribe() {
        // Subscribe to the twitch "Channel changes status" webhook
        await fetch("https://api.twitch.tv/helix/webhooks/hub", {
            method: "POST",
            body:    JSON.stringify({
                "hub.callback": `${process.env.SERVER_URL}/streamchanged`,
                "hub.mode": "subscribe",
                "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${process.env.TWITCH_CHANNEL_ID}`,
                "hub.lease_seconds": 864000,
                "hub.secret": process.env.SECRET
            }),
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization':`Bearer ${process.env.TWITCH_BEARER_TOKEN}`,
                'client-id': process.env.TWITCH_CLIENT_ID
            }
        });
    
        // Save the expiration date in the db
        let current_date = new Date();
        let expiration_date = current_date.setSeconds(current_date.getDate() + 864000);
    
        let query = `UPDATE streamers SET subscription_expiration = ${expiration_date} WHERE streamer_name = '${process.env.TWITCH_CHANNEL}'`;
        
        // TODO: Check if there's an SQL error and do something (maybe unsubscribe and yell that an error ocurred?)
        let queryResult = await db.query(query);
    }
}


// const app = express();
// const NotificationEmiter = new EventEmmiter();


// const startServer = () => {
//     app.listen(process.env.PORT || 3000, async () => {
//         // Check if the subscription to the twitch "Channel changes status" webhook has expired
//         let query = (`SELECT subscription_expiration FROM streamers WHERE streamer_name = '${process.env.TWITCH_CHANNEL}'`);
        
//         // TODO: If no result is returned or if expiration is 0, resubscribe
//         try {
//             let queryResult = await db.query(query)
//             let {subscription_expiration} = queryResult[0]

//             if(Date.now() > subscription_expiration){
//                 console.log("Subscription has expired, resubscribing...");
//                 subscribe();    
//             }
//         } catch (error) {
//             console.log(error.code);
//         }
//     });
// }

// const Subscribe = async () => {
//     // Subscribe to the twitch "Channel changes status" webhook
//     await fetch("https://api.twitch.tv/helix/webhooks/hub", {
//         method: "POST",
//         body:    JSON.stringify({
//             "hub.callback": `${process.env.SERVER_URL}/streamchanged`,
//             "hub.mode": "subscribe",
//             "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${process.env.TWITCH_CHANNEL_ID}`,
//             "hub.lease_seconds": 864000,
//             "hub.secret": process.env.SECRET
//         }),
//         headers: { 
//             'Content-Type': 'application/json', 
//             'Authorization':`Bearer ${process.env.TWITCH_BEARER_TOKEN}`,
//             'client-id': process.env.TWITCH_CLIENT_ID
//         }
//     });

//     // Save the expiration date in the db
//     let current_date = new Date();
//     let expiration_date = current_date.setSeconds(current_date.getDate() + 864000);

//     let query = `UPDATE streamers SET subscription_expiration = ${expiration_date} WHERE streamer_name = '${process.env.TWITCH_CHANNEL}'`;
    
//     // TODO: Check if there's an SQL error and do something (maybe unsubscribe and yell that an error ocurred?)
//     let queryResult = await db.query(query);
// }

module.exports = NotificationServer;
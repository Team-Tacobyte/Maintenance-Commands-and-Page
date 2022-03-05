// https://expressjs.com/
// Framework for the HTTP side of the server
import express from "express";
const app = express();

const mt_ware = express.static('public_mt')
const p_ware = express.static('public');

app.use((req, res, next) => {
    // Change middleware based on whether maintenance mode is enabled/disabled
    process.env.MT === 'true' ? mt_ware(req, res, next) : p_ware(req, res, next);
});

app.listen(process.env.PORT, () => {
    console.log(`Express HTTP Server Listening To ${process.env.PORT}`)
})
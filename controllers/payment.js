const express = require('express')
const path = require('path');
const app = express();
const register = require('../models/accountschema');
const paymentpath = path.join(__dirname, "../views/payment.ejs")
app.set('view  engine','ejs');
async function getpaymentpage(req, res) {
    return res.render(paymentpath);
}


async function paygame(req, res) {
    try {
        const username = await req.cookies.username;
        const gamename = await req.cookies.gamename;
        const activeuser = await register.findOne({ username: username });
        if (activeuser) {
            if (activeuser.purchase.includes(gamename)) {
                res.status(200).json({
                    paymessage: "YOU HAVE ALREADY DOWNLOADED THE GAME",
                    downloadmessage:""
                });
            } else {
                activeuser.purchase.push(gamename);
                await activeuser.save();
                res.status(200).json({
                    paymessage: "successfully game purchased 1",
                    downloadmessage: "Now you can download the game !"
                });
            }
        } else {
            res.status(404).json({ errorMessage: "PLEASE DO LOGIN!!!" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

async function downloadgame(req, res) {
    try {
        const username = await req.cookies.username;
        const gamename = await req.cookies.gamename;
        const activeuser = await register.findOne({ username: username });
        if (activeuser) {
            activeuser.download.push(gamename);
            await activeuser.save();
            res.status(200).json({
                message: "successfully game Downloaded",
            });
        } else {
            res.status(404).json({ errorMessage: "activeuser not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}
module.exports = { getpaymentpage, paygame, downloadgame }
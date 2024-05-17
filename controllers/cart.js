const express = require('express')
const app=express();
const register = require('../models/accountschema');
const path = require('path')
app.set('view  engine','ejs');
const game_details = require("../models/gameschema");
const cartpath=path.join(__dirname, "../views/cart.ejs")
async function getcart(req,res)
{
    res.render(cartpath);
}
async function addtocart(req,res)
{
    try { 
   
        if (req.cookies.username) {
          const curr_user = req.cookies.username;
          const cart_games = req.body.cart_games;
    
          const exists_user = await register.findOne({ username: curr_user });
    
          exists_user.cart.push(cart_games);
          await exists_user.save();
          res
            .status(201)
            .json({ successMsg: "Successfully Added To Cart Visit Cart To BUY " });
        } else {
          res.status(401).json({
            errorMessage: "Please Login First To add Games Into The Cart",
          });
        }
      } catch (error) {
        console.log("Internal Server Error" + error);
      }
}

async function getcartgames(req,res){
    try {
        if (req.cookies.username) {
          const curr_user = req.cookies.username;
          const user_data = await register.findOne({ username: curr_user });
    
          const cart_game = [];
    
          for (const ip of user_data.cart) {
            const game = await game_details.findOne({ game_name: ip });
    
            if (game) {
              cart_game.push(game);
            }
          }
    
          res.json(cart_game);
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ errorMessage: "Error processing data" });
      }
}

async function removetocart(req,res)
{
    try {
        if (req.cookies.username) {
          const curr_user = req.cookies.username;
          const cart_games = req.body.cart_games;
    
          const exists_user = await register.findOneAndUpdate(
            { username: curr_user },
            { $pull: { cart: cart_games } }
          );
    
          res.status(201).json({ successMsg: "Removed From Cart" });
        } else {
          res.status(401).json({
            errorMessage: "Please Login First To add Games Into The Cart",
          });
        }
      } catch (error) {
        console.error("Internal Server Error" + error);
        res.status(500).json({ errorMessage: "Internal Server Error" });
      }
}


module.exports={getcart,addtocart,getcartgames,removetocart};
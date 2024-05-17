const express=require('express');
const app=express()
const path=require('path')
const bcrypt = require("bcryptjs");
const register=require('../models/accountschema');
const game_details=require('../models/gameschema');
const authController = require('../controllers/login');
let arr = authController.arr;

app.set('view  engine','ejs');

async function gethome(req,res){
return res.sendFile(path.join(__dirname , "../public/home.html"));
}
async function getabout(req,res){
    return res.render(path.join(__dirname ,"../views/about.ejs"))
}
async function getnews(req,res){
    return res.render(path.join(__dirname ,"../views/news.ejs"))
}
async function getfaq(req,res){
    // return res.sendFile(path.join(__dirname ,"../public/faq.html"))
    res.render(path.join(__dirname ,"../views/faq.ejs"))
}
async function getfpassword(req,res){
    return res.sendFile(path.join(__dirname ,"../public/fpassword.html"))
}

async function getuserdata(req,res){
    const username = req.cookies.username;
    try {
      const db_user = await register.findOne({ username });
      res.json(db_user);
    } catch (error) {
      res.status(401).json({ errorMessage: "Internal server error" });
    }
}
async function signout(req,res){
    let username = req.cookies.username;
    res.clearCookie("username");
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === username) {
            arr.splice(i, 1);
            break;
        }
    }
    console.log("User Logged Out");
    res.redirect("/");
}


async function getcategories(req,res)
{
    try {
        var search_term = req.query.search.toUpperCase();
    
        const searchTermRegex = new RegExp(search_term, "i");
        const games_filtered = await game_details
          .find({ category: { $regex: searchTermRegex } })
          .limit(5);
        res.json(games_filtered);
      } catch (error) {
        console.log("Server is issue" + error);
      }
}

async function getsearch(req,res)
{
    return res.render((path.join(__dirname ,"../views/search.ejs")));
}

async function getgenre(req,res)
{
    return    res.render((path.join(__dirname ,"../views/genre.ejs")));
}

async function getgames(req,res)
{
    try {
        var search_term = req.query.search.toUpperCase();
         const searchTermRegex = new RegExp('^' + search_term, "i"); 
         const games_filtered = await game_details
      .find({
        $or: [{ game_name: searchTermRegex }, { category: searchTermRegex }],
      })
      .limit(5);
        
        res.json(games_filtered);
      } catch (error) {
        console.error("Error searching for games:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}

async function getGame(req,res)
{
    const game_name = req.body.game_name;

    try {
      const gameName = new RegExp(game_name, "i");
      const product = await game_details.findOne({ game_name: gameName });
  
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ errorMessage: "Product not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ errorMessage: "Internal server error" });
    }
}

module.exports={gethome,getabout,getfaq,getnews,getfpassword,getuserdata,signout,getcategories,getsearch,getgenre,getgames,getGame,arr:arr}
const express = require('express')
const app=express();
app.set('view  engine','ejs');
const path = require('path')
const register = require('../models/accountschema');
const game_details = require("../models/gameschema");
const { Console } = require('console');
const gamepagepath=path.join(__dirname, "../views/game-page.ejs")
async function getgamepage(req, res){
    res.render(gamepagepath);
}

// async function postreview(req, res){
//   const {postreview,reviewrating} =await req.body;
//   const gamename=req.cookies.gamename;
//   var currentrating;
//   var newrating;
//   try {
//     const find = await  game_details.findOne({game_name:gamename });
//      currentrating=find.rating;
//      newrating=await ((currentrating*find.reviews.length)+parseInt(reviewrating))/(find.reviews.length+1);
//     if (!find) {
//       return res.status(401).json({ message: "game not found !" });
//     }
//     else if(!req.cookies.username)
//     {
//       return res.status(401).json({ message: "Please login to post review !" });
//     }
//     else {
//       const username=req.cookies.username;
//       const y=await game_details.findOne({game_name:gamename},{reviews:{$elemMatch:{name:username}}});
//       if(y.reviews.length!=0)
//       {
//         return res.status(401).json({ message: "You have already reviewed and rated the game !" });
//       }
//       else
//       { 
//       const x=await game_details.findOneAndUpdate(
//         {game_name: gamename },
//         {$set:{rating:newrating},$push:{reviews:{name:username,review:postreview.trim(),rating:reviewrating}}},
//         { new: true });
//       if (!x) {
//         return res.status(401).json({ message: "Couldn't post review !" });
//       } else {
//         console.log( "Review posted successfully!!")
//         return res.status(200).json({ message: "Review posted successfully!!" });
//       }
//       }
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal Server error !" });
//   }
// }

async function postreview(req, res){
  const { postreview, reviewrating } = await req.body;
  const gamename = req.cookies.gamename;
  var currentrating;
  var newrating;
  try {
    const find = await game_details.findOne({ game_name: gamename });
    if (!find) {
      return res.status(401).json({ message: "Game not found!" });
    } else if (!req.cookies.username) {
      return res.status(401).json({ message: "Please login to post a review!" });
    } else {
      const username = req.cookies.username;
      const y = await game_details.findOne({ game_name: gamename }, { reviews: { $elemMatch: { name: username } } });
      if (y.reviews.length !== 0) {
        return res.status(401).json({ message: "You have already reviewed and rated the game!" });
      } else {
        currentrating = find.rating;
        newrating = ((currentrating * find.reviews.length) + parseInt(reviewrating)) / (find.reviews.length + 1);
        const x = await game_details.findOneAndUpdate(
          { game_name: gamename },
          { $set: { rating: newrating }, $push: { reviews: { name: username, review: postreview.trim(), rating: reviewrating } } },
          { new: true }
        );
        if (!x) {
          return res.status(401).json({ message: "Couldn't post the review!" });
        } else {
          // Return the updated game data
          const updatedGameData = await game_details.findOne({ game_name: gamename });
          await updatedGameData.save();
           res.json({  updatedGameData });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
}


async function getproduct(req, res){
  const imageUrl = req.body.imageUrl;
  try {
    const product = await game_details.findOne({ "clips.url": imageUrl });
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

module.exports={getgamepage,getproduct,postreview}
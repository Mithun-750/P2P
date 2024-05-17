const express = require('express')
const path = require('path');
const bcrypt = require("bcryptjs");
const cookie_parser = require("cookie-parser");
const register = require('../models/accountschema');
var arr=[];

async function getlogin(req, res) {
  return res.sendFile(path.join(__dirname, "../public/login.html"));
}

async function postlogin(req, res) {
  const { username, password } = req.body;
  //const { username } = req.body;

  try {
    const exists = await register.findOne({ username });

    if (!exists) {
      console.log("User not found for username:-", username);
      return res.status(401).json({ errorMessage: "Username not found" });
    }

    console.log("USERNAME:-" + exists.username);

    const isPass = await bcrypt.compare(password, exists.password);
    const role = exists.role;
    //console.log(role)

    if (isPass) {
      arr.push(username);
     // console.log(arr);
      res.cookie("username", username);

        res.redirect("/");
  
    } else {
      console.log("Incorrect password for username:-", username);
      res.status(401).json({ errorMessage: "Incorrect password" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ errorMessage: "Error processing data" });
  }
}
module.exports = { getlogin, postlogin,arr:arr }
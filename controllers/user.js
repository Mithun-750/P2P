const express=require('express')
const path=require('path')
const bcrypt = require("bcryptjs");
const register=require('../models/accountschema');
async function getuser(req,res){
    return res.sendFile(path.join(__dirname , "../public/userprofile.html"));
}
async function postuserpassword(req,res){
    const {username,backupKey,password,confirm_pass} = req.body;
    try{
      const exist = await register.findOne({ username });
      if(confirm_pass!== password)
      {
        return res.status(401).json({ errorMessage: "Please Enter same Password" });
      }
      if (!exist) {
        return res.status(401).json({ errorMessage: "User not found" });
      }
  
       const isKey= await exist.securitykey 
      if (isKey===backupKey) {
        exist.securitykey = backupKey;
        const pswd= await bcrypt.hash(password,10);
        exist.password= pswd;
        console.log("username :-" + exist.username + " changed  password to:-" + password);
        await exist.save();
        res.redirect("/login"); 
      } else {
        res.status(401).json({ errorMessage: "Wrong backupkey" });
      }
       
    }
    catch(error)
    {   console.error("Error:", error);
       res.status(500).send("Error Updating Information Please try again")
    }
}


async function postupdateuser(req,res){
  const username = req.cookies.username;
  try {
    const { new_email, password } = req.body;
    const exist = await register.findOne({ username });
  
    if (!exist) {
      return res.status(401).json({ errorMessage: "User not found" });
    }

    const isPass = await bcrypt.compare(password, exist.password);
    if (isPass) {
      exist.email = new_email;
      console.log("username :-" + exist.username + " changed email to: -" + new_email);
      await exist.save();
      res.redirect("/user"); 
    } else {
      res.status(401).json({ errorMessage: "Wrong Password" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server issues ");
  }
}
module.exports={getuser,postuserpassword,postupdateuser}
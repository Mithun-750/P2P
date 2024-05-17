const express=require('express')
const path=require('path')
const bcrypt = require("bcryptjs");
const register=require('../models/accountschema');
async function getregister2(req,res){
   return  res.sendFile(path.join(__dirname , "../public/register2.html"));
}
async function postregister2(req,res)
{
    try {
        const { dateOfBirth, backupKey } = req.body;
    
        const latest_user = await register.findOne().sort({ _id: -1 }).limit(1);
    
        if (!latest_user) {
          return res.status(404).send("No user found");
        }
    
        latest_user.dateofbirth = dateOfBirth;
        latest_user.securitykey = backupKey;
    
        await latest_user.save();
        console.log(latest_user);
        res.redirect("/login");
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server issues ");
      }
}
module.exports={getregister2,postregister2}
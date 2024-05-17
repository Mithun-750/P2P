const express = require('express')
const path = require('path')
const bcrypt = require("bcryptjs");
const register = require('../models/accountschema');
const home = require("./home");
const  app = express();
const adminpath=path.join(__dirname, "../public/admin.ejs")
const managerpath=path.join(__dirname, "../public/manager.ejs")
app.set('view  engine','ejs');

async function getadmin(req, res) {      
  return res.sendFile(adminpath);   
}

async function getmanager(req, res) {
  return res.sendFile(managerpath);
}

async function getLoginDet(req, res) {
  const x = home.arr;
  res.send(x);
}

async function getRegDet(req, res) {
  try {
    const y = await register.find({}, { username: 1 });
    console.log(y);
    res.send(y);
  } catch (error) {
    console.log(error);
  }
}
async function delAcc(req, res) {
   const { deleteaccountno } = await req.body;
   const currentuser= await req.cookies.username;
  try {
    const find = await register.findOne({ username: deleteaccountno });
    if (!find) {
      return res.status(401).json({ message: "username not found !" });
    }
    else{
     
      if(currentuser==deleteaccountno)
      { 
        return res.status(401).json({ message: "You can't delete your own account !" });
      }
      else if(find.role=="admin")
     {
      return res.status(401).json({ message: "You can't delete an Admin account !" });
     }
      else{
      const username = await register.findOneAndDelete({ username: deleteaccountno });
      if (!username) {
        return res.status(401).json({ message: "Couldn't delete Account !" });
      } else {
        return res.status(200).json({ message: "Account deleted successfully!!" });
      }
    }
    }
    
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: "error !" });
  }
}


async function updatepassword(req, res) {
  const { usernametoupdate, newpassword } = req.body;
  try {
    const find = await register.findOne({ username: usernametoupdate });
    const hash_pswd = await bcrypt.hash(newpassword, 10);
    if (!find) {
      return res.status(401).json({ message: "username not found !" });
    }
    else if(find.role=='admin')
    {
      return res.status(401).json({ message: "you don't have permission to update ADMIN's Password !" });
    }
    else {
      const x = await register.findOneAndUpdate(
        { username: usernametoupdate },
        { $set: { password: hash_pswd } },
        { new: true }
      );
      if (!x) {
        return res.status(401).json({ message: "Couldn't update Password !" });
      } else {
        return res.status(200).json({ message: "Password updated successfully!!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server error !" });
  }
}


async function updaterole(req,res){
    const {usernametoupdaterole , newrole} = req.body;
    const currentuser= await req.cookies.username;
    try {
      const find = await register.findOne({ username: usernametoupdaterole });
      if (!find) {
        return res.status(401).json({ message: "username not found !" });
      }
        else{
          if(currentuser==usernametoupdaterole)
          {
            return res.status(401).json({ message: "You can't update your own role !" });
          }
          else if(find.role=="admin"){
            return res.status(401).json({message : "You can't change the role of an admin"})
          }
          else if(find.role==newrole){
            return res.status(401).json({message : ` Account holder is already an ${find.role} !`})
          }
        else{
        const x = await register.findOneAndUpdate(
          { username: usernametoupdaterole },
          { $set: { role: newrole } },
          { new: true }
        );
        if (!x) {
          return res.status(401).json({ message: "Couldn't update Role !" });
        } else {
          return res.status(200).json({ message: "Role updated successfully!!" });
        }
      }
        }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server error !" });
    }
}

module.exports = { getadmin,getmanager, getLoginDet, getRegDet,delAcc,updatepassword,updaterole };
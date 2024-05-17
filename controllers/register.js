const express = require('express')
const path = require('path')
const bcrypt = require("bcryptjs");
const register = require('../models/accountschema');
async function getregister(req, res) {
  return res.sendFile(path.join(__dirname, "../public/register.html"));
}
async function postregister(req, res) {
  try {var userrole='user'
    const { email, username, password, confirm_pass } = req.body;

    const hash_pswd = await bcrypt.hash(password, 10);

    const exists = await register.findOne({ username });
    const exists1 = await register.findOne({ email });
    if (confirm_pass !== password) {
      return res.status(401).json({ errorMessage: "Please Enter same Password" });
    }
    const totalusers = await register.countDocuments({});
    if (totalusers == 0) {
      userrole='admin'
    }
    else if(totalusers<3)
    {
      userrole='manager'
    }
    if (exists) {
      console.log("username already exists for:", username);
      return res.status(401).json({ errorMessage: "Username already exists" });
    }

    if (exists1) {
      console.log("Email already exists for:", username);
      return res.status(401).json({ errorMessage: "Email already exists" });
    }
    const new_user = new register({
      email,
      username,
      password: hash_pswd,
      role:userrole
    });
    console.log(userrole,totalusers)
    console.log("!!NEW USER REGISTRATION!!");
    console.log("NEW USER DETAILS:-");
    console.log(new_user);

    await new_user.save();
    res.redirect("/register2");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
module.exports = { getregister, postregister }
const express = require('express')
const path = require('path')
const register = require('../models/accountschema');
const cookie_parser = require("cookie-parser");
const app= express();
app.use(cookie_parser);
app.set('view  engine','ejs');
async function def(req, res) {
    
    const exists= await register.findOne({username: req.cookies.username})

    if(exists)  
    {
        if (exists.role === "admin") {
           res.render(path.join(__dirname,"../public/admin.ejs"),{msg:""});
           console.log("ADMIN Succesfully Logged In!!")
        }
        else if(exists.role === "manager")
        {
            res.render(path.join(__dirname,"../public/manager.ejs"),{msg:""});
            console.log("MANAGER Succesfully Logged In!!")
        }
        else {
          res.redirect("/home");
           console.log("USER Succesfully Logged In!!")
        }
    }
    else{
    res.sendFile(path.join(__dirname,"../public/home.html"));
    }
}

module.exports={def};
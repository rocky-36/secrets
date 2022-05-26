require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const app = express();

const mongoose = require("mongoose");

const encrypt = require("mongoose-encryption");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/usersDB");

const userSchema = new mongoose.Schema({email: {
  type: String,
  required: true
},password: {type: String,required: true}});


userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY,encryptedFields: ["password"] });

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const userdata = new User({
    email: req.body.username,
    password: req.body.password
  });
  userdata.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const enUsername = req.body.username;
  const enPassword = req.body.password;
  User.findOne({email: enUsername},function(err,foundList){
    if(err){
      console.log(err);
    }else{
      if(foundList){
        if(foundList.password === enPassword){
          res.render("secrets");
        }
      }
    }
  });
});


app.listen(3000,function() {
  console.log("server is up and running");
});
require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const app = express();

const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const saltRounds = 10;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/usersDB");

const userSchema = new mongoose.Schema({email: {
  type: String,
  required: true
},password: {type: String,required: true}});


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

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const userdata = new User({
      email: req.body.username,
      password: hash
    });
    userdata.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    });
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
        bcrypt.compare(enPassword, foundList.password, function(err, result) {
          if(result === true){
            res.render("secrets");
          }
});
      }
    }
  });
});


app.listen(3000,function() {
  console.log("server is up and running");
});

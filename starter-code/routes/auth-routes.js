const express = require('express');
const authRoutes = express.Router();
const Customer = require("../models/customer");
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


// -----------------------------------------------SIGN UP
authRoutes.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});
 //encrypt password 
authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
//creates new customer 
  const newCustomer  = Customer({
    username,
    password: hashPass
  });
//validate user & password insertion
  if (username === "" || password === "") {
    res.render("auth/signup", {
        errorMessage : "Indicate a username and password to sign up"
    });
    res.end();
  };
//validate if customer already exists
  Customer.findOne({ "username": username }, //search condition
  "username", //projection!
  (err, customer) => {
    if (customer !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      res.end();
    }
  });
//redirect to index if there's an error in the fillup of a new customer
 newCustomer.save((err) => {
    res.redirect("/");
  });
});

//---------------------------------------------------LOGIN
authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login");
});
//require customer's data for login
authRoutes.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
//checks if customers fills up the login form
  if (username === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      res.end();
    };
//check if the customer username exists
 Customer.findOne({ "username": username }, (err, customer) => {
      if (err || !customer) {
        res.render("auth/login", {
          errorMessage: "This username doesn't exist"
        });
        res.end();
      }
      if (bcrypt.compareSync(password, customer.password)) {
        // Save the login in the session!
        req.session.currentCustomer = customer;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
        res.end();
      }
  });
});


module.exports = authRoutes;
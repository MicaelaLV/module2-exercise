const express     = require('express');
const authRoutes  = express.Router();
const Customer    = require("../models/customer");
const bcrypt      = require('bcrypt');
const bcryptSalt  = 10;


// --------------------------------------------------- Customer's SIGN UP
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
    return res.render("auth/signup", {
        errorMessage : "Indicate a username and password to sign up"
    });
  }
  //validate if customer already exists
  Customer.findOne(
    { "username": username }, //search condition
    "username", //projection!
    (err, customer) => {
      if (customer !== null) {
        return res.render("auth/signup", {
          errorMessage: "The username already exists",
        }); 
      } else {
          newCustomer.save((err) => {
            return res.redirect("/search");
          })
      }
    })
 });

//----------------------------------------------------- Customer's LOGIN
authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login");
});
//require customer's data for login
authRoutes.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  //checks if customers fills up the login form
  if (username === "" || password === "") {
      return res.render("auth/login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
  }
  //check if the customer username exists
  Customer.findOne({ "username": username }, (err, customer) => {
      if (err || !customer) {
       return res.render("auth/login", {
          errorMessage: "This username doesn't exist"
        })
      }
      if (bcrypt.compareSync(password, customer.password)) {
        // Save the login in the session!
        req.session.currentCustomer = customer;
        res.redirect("/search");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
        return;
      }
  });
});

authRoutes.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

//----------------------------------------------------- Customer's LOGOUT
authRoutes.get('/search', (req, res, next) => {
  res.render('search', {
    name: "FoodApp",
    postalcode: ["80080", "80109", "80817"],
    cuisine: ["italian", "greek", "chinese", "french", "sushi"]
  });
 });



module.exports = authRoutes;
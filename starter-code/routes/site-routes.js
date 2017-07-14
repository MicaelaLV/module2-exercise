const express = require('express');
const siteRoutes = express.Router();

//INDEX PAGE
siteRoutes.get("/", (req, res, next) => {
    res.render('index');
});

//CUSTOMER SEARCH PAGE
siteRoutes.get("/search", (req, res, next) => {
    res.render('search');
});

//CUSTOMER LOGIN PAGE
siteRoutes.use((req, res, next) => {
    if(req.session.currentCustomer) {
        next();
    } else {
        res.redirect("/login");
    }
});


siteRoutes.get("/private", (req, res, next) => {
    res.render('private');
});

siteRoutes.get("/main", (req, res, next) => {
    res.render('main');
});


module.exports = siteRoutes;
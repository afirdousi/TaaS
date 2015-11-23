
var appUserHelper = require('../services/appUserHelper');
var users = require('../db/users');

var express = require('express');
var router = express.Router();

router.get("/currentUser", function(req, res, next) {
    var appUser = appUserHelper(req);
    res.json(appUser.userDetails);
});

module.exports = router;

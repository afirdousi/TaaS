/**
 * Created by Anas on 11/27/2015.
 */
var testerProject = require('../../db/tester/projects');

var express = require('express');
var router = express.Router();


//Used for "User Profile" of Tester
router.get("/tester/projectnames", function(req, res, next) {

    console.log("Hitting /tester/projectnames ");

    testerProject
        .getProjectSuggestions()
        .then(function (result) {

            /* console.log("getAppStatus()  result = ");*/


            res.json(result);
        })
        .catch(function (err) {
            next(err);
        });

});



module.exports = router;


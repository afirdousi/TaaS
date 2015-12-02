/**
 * Created by Anas on 11/27/2015.
 */
var testerProfile = require('../../db/tester/projects');

var express = require('express');
var router = express.Router();


//Used for "User Profile" of Tester
router.get("/tester/fullprojects", function(req, res, next) {

    console.log("API/ PROFILE /  FULL PROFILE");

    testerProfile
        .getTesterFullProjects()
        .then(function (result) {

            /* console.log("getAppStatus()  result = ");
             console.log(result);*/

            res.json(result);
        })
        .catch(function (err) {
            next(err);
        });

});

//Used for "User Dashboard" of Tester
router.get("/basicprojects", function(req, res, next) {

    /*appMaintenanceCollection
     .getAppStatus()
     .then(function (result) {

     /!* console.log("getAppStatus()  result = ");
     console.log(result);*!/

     res.json(result);
     })
     .catch(function (err) {
     next(err);
     });*/

});



module.exports = router;


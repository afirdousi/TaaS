
var appUserHelper = require('../services/appUserHelper');
var users = require('../db/users');

var express = require('express');
var router = express.Router();

router.get("/users", function(req, res, next) {
    var appUser = appUserHelper(req);
    if(!appUser.isInAdminRole) {
        res.sendStatus(403);
    }
    else {
        users
            .getUsers()
            .then(function(result) {
                res.json(result);
            })
            .catch(function(err) {
                next(err);
            });
    }
});

router.post("/users", function(req, res, next) {
    var appUser = appUserHelper(req);
    if(!appUser.isInAdminRole) {
        res.sendStatus(403);
    }
    else {
        users
            .addUser(req.body)
            .then(function (result) {
                res.status(201).json(result);
            })
            .catch(function (err) {
                next(err);
            });
    }
});

router.get("/users/:userId", function(req, res, next) {
    var appUser = appUserHelper(req);
    if(!appUser.isInAdminRole) {
        res.sendStatus(403);
    }
    else {
        users
            .getUser(req.params.userId)
            .then(function (result) {
                if (result === null) {
                    res.sendStatus(204);
                }
                else {
                    res.json(result);
                }
            })
            .catch(function (err) {
                next(err);
            });
    }
});

router.put("/users/:userId", function(req, res, next) {
    var appUser = appUserHelper(req);
    var userId = req.params.userId;
    if(!appUser.isInAdminRole) {
        res.sendStatus(403);
    }
    else if (req.body.userId !== userId) {
        res.status(400).send("Invalid user id.");
    }
    else {
        users
            .updateUser(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    }
});

router.delete("/users/:userId", function(req, res, next) {
    var appUser = appUserHelper(req);
    if(!appUser.isInAdminRole) {
        res.sendStatus(403);
    }
    else {
        return users
            .deleteUser(req.params.userId)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    }
});

module.exports = router;

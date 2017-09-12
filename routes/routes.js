var express = require("express");
var router = express.Router();

var userController = require('../controllers/user');

/*Rutas Principales*/
router.get("/",function (req,res) {
    res.render("index");
});
router.get("/signup",function (req,res) {
    res.render("signup");
});
router.get("/login",function (req,res) {
    res.render("login");
});
router.post("/users",userController.createUser);
router.post("/sessions",userController.login);
router.get("/logout",userController.signout);

module.exports = router;
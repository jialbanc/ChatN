
var express = require("express");
var router_app = express.Router();

var chatController = require('../controllers/chat');


var chat_finder_middleware = require("../middleware/find_chat");

router_app.get("/",chatController.getChats);

/* REST */

/**
 * Chats
 * */
router_app.get("/chats/new",function(req,res){
    res.render("app/chats/new");
});
router_app.all("/chats/:id*",chat_finder_middleware);
router_app.get("/chats/:id/edit",function(req,res){
    res.render("app/chats/edit");
});
router_app.get("/chats/:id/join",chatController.joinChat);
router_app.get("/chats/:id/leave",chatController.leaveChat);
router_app.post("/chats/:id/sendM",chatController.sendMessage);

router_app.route("/chats/:id")
    .get(function(req,res){
        res.io.sockets.emit("joinChat",{room: req.params.id});
        res.render("app/chats/show");
    })
    .put(chatController.editChat)
    .delete(chatController.deleteChat);
router_app.route("/chats")
    .get(chatController.getMyChats)
    .post(chatController.createChat);



/**
 * Message
 */

router_app.route("/messages")
    .post(chatController.sendMessage);

module.exports = router_app;

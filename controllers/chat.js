var Chat = require("../models/chat").Chat;
var User = require("../models/user").User;
var Message = require("../models/message").Message;

// var redis = require("redis");

// var client = redis.createClient();

exports.getChats = function(req,res){
    Chat.find({})
        .populate("members",["_id"],{ _id: req.session.user_id})
        .exec(
            function(err,chats){
            if(err) console.log(err);
            // console.log(chats.toString());
            res.render("app/home",{chats: chats, session: req.session});
        });
};

exports.getMyChats = function(req,res){
    User.findById(req.session.user_id)
        .populate("chats")
        .exec(function(err,user){
        if(err){ res.redirect("/app");return;}
        res.render("app/chats/index",{chats: user.chats})
    });
    /*console.log(req.session.user_id);
    Chat.find({"members._id": req.session.user_id},function(err,chats){
        if(err){ res.redirect("/app");return;}
        res.render("app/chats/index",{chats: chats})
    });*/
};

exports.editChat = function(req,res){
    res.locals.chat.title = req.body.title;
    res.locals.chat.save(function(err){
        if(!err){
            res.render("app/chats/show");
        }else{
            res.render("app/chats/"+req.params.id+"/edit");
        }
    });
};

exports.deleteChat = function(req,res){

    Chat.findByIdAndRemove(req.params.id,function(err){
        if(!err){
            User.update({},{$pull: {chats: req.params.id}},{multi:true},function (err) {
                if(!err){
                    res.redirect("/app/chats");
                }else{
                    // console.log(chat);
                    res.render(err);
                }
            });
        }else{
            console.log(err);
            res.redirect("/app/chats/"+req.params.id)
        }
    });
};

exports.createChat = function(req, res){
    var data = {
        title: req.body.title,
        members: req.session.user_id
    };
    var chat = new Chat(data);
    chat.save(function(err){
        if(!err){
            User.findByIdAndUpdate(req.session.user_id,{$push: {chats: chat._id}},function (err) {
               if(!err){
                   // res.io.sockets.join(chat._id);
                   res.redirect("/app/chats/"+chat._id);
               }else{
                   // console.log(chat);
                   res.render(err);
               }
            });
        }else{
            // console.log(chat);
            res.render(err);
        }
    });
};

exports.joinChat = function(req,res){
    Chat.findByIdAndUpdate(req.params.id,{$push: {members: req.session.user_id}},function (err) {
        if(!err){
            User.findByIdAndUpdate(req.session.user_id,{$push: {chats: req.params.id}},function (err) {
                if(!err){
                    // res.io.sockets.join(req.params.id);
                    res.redirect("/app/chats/"+req.params.id);
                }else{
                    // console.log(chat);
                    res.render(err);
                }
            });
        }else{
            // console.log(chat);
            res.render(err);
        }
    });
};

exports.leaveChat = function(req,res){
    Chat.findByIdAndUpdate(req.params.id,{$pull: {members: req.session.user_id}},function (err) {
        if(!err){
            User.findByIdAndUpdate(req.session.user_id,{$pull: {chats: req.params.id}},function (err) {
                if(!err){
                    // res.io.sockets.leave(req.params.id);
                    res.redirect("/app/");
                }else{
                    // console.log(chat);
                    res.render(err);
                }
            });
        }else{
            // console.log(chat);
            res.render(err);
        }
    });
};

exports.sendMessage = function(req, res){
    // console.log(req.body.body_message);
    var data = {
        body: req.body.body_message,
        author: req.session.user_id,
        chat: req.body.chat_id
    };
    var message = new Message(data);
    message.save(function(err){
        if(!err){
            var messageJSON = {
                "username": res.locals.user.username,
                "body": message.body
            };
            res.io.sockets.emit("new message",JSON.stringify(messageJSON));
            // client.publish("messages",JSON.stringify(messageJSON));

            res.redirect("/app/chats/"+req.body.chat_id);
        }else{
            // console.log(chat);
            res.render(err);
        }
    });
};
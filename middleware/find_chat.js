var Chat = require("../models/chat").Chat;
var Message = require("../models/message").Message;

module.exports = function (req,res,next){
    /*Relacion uno a muchos*/
    Chat.findById(req.params.id)
            .populate("members")
            .exec(function(err,chat){
                // console.log(chat);
                if(chat != null ){
                    // res.io.sockets.join(req.params.id);
                    Message.find({chat: chat._id})
                        .populate("author")
                        .populate("chat")
                        .exec(function(err,messages){
                            if(!err){
                                res.locals.messages = messages;
                                res.locals.chat = chat;
                                next();
                            }else{
                                res.redirect("/app");
                            }
                        });
                }else{
                    res.redirect("/app");
                }
        });
}
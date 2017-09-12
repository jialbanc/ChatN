module.exports = function(server,sessionMiddleware){
    var io = require("socket.io")(server);
    // var redis = require("redis");
    // var client = redis.createClient();
    var chat = null;
    // client.subscribe("messages");

    io.use(function(socket,next){
        sessionMiddleware(socket.request,socket.request.res,next);
    });

    /*client.on("message",function (channel, message) {
        if(channel=="messages"){
            io.emit("new message", message)
        }
    });*/

    io.sockets.on("connection",function(socket){
       console.log(socket.request.session.user_id);

       socket.on('joinChat', function(data) {
           if(chat!=null)
                socket.leave(chat);
            console.log("Abandonando chat");
            console.log(chat);
            chat=data.room;
            socket.join(chat);

            console.log(chat);
        });

    });

    return io;
};
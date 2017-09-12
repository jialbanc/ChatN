var socket = io();

socket.on("new message",function(data){
   data = JSON.parse(data);
   var container = document.querySelector("#messages");
   var source = document.querySelector("#message-template").innerHTML;

   var template = Handlebars.compile(source);

   container.innerHTML = container.innerHTML + template(data);
});
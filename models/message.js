var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/chat",{useMongoClient: true});

var message_schema = new Schema({
    chat : { type: Schema.ObjectId, ref: 'Chat', required: true },
    author:  { type: Schema.ObjectId, ref: 'User' },
    body: {type: String, required: true},
    created_at: {type: Date, default: Date.now()}
});

var Message = mongoose.model("Message",message_schema);

module.exports.Message=Message;
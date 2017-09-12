var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/chat",{useMongoClient: true});

var chat_schema = new Schema({
    title: String,
    is_active: {type:Boolean, default: true},
    created_at: {type: Date, default: Date.now()},
    members:  [{ type: Schema.ObjectId, ref: 'User' }]
});

var Chat = mongoose.model("Chat",chat_schema);

module.exports.Chat=Chat;
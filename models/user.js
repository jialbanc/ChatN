var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/chat",{useMongoClient: true});

var posibles_valores = ["M","F"];

var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Colocar un email válido"];

var password_validation = {
    // esta funcion debe retornar falso o verdadero
    validator: function(p){
        return this.password_confirmation == p;
    },
    message: "Las contraseñas no son iguales"
};

var user_schema = new Schema({
    username: {
        type: String,
        required: true,
        maxLength: [50,"Username muy grande"]
    },
    password: {
        type: String,
        minlength: [4,"El password es muy corto"],
        validate: password_validation
    },
    email: {type: String, required: "El correo es obligatorio", match: email_match},
    is_active: {type: Boolean, default: false},
    chats: [{ type: Schema.ObjectId, ref: 'Chat' }]
});

user_schema.virtual("password_confirmation").get(function (){
  return this.p_c;
}).set(function(password){
    this.p_c = password;
});


/*Esto equivale a una tabla
* crea una coleccion llamada users osea en plural
* */
var User = mongoose.model("User",user_schema);

module.exports.User = User;
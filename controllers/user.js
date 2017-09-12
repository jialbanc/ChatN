var User = require("../models/user").User;

exports.createUser = function(req, res){
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation,
        username: req.body.username
    });
    user.save().then(function(){
        res.render("./login");

    },function(err){
        if(err){
            console.log(String(err));
            res.send("No pudimos guardar la información");
        }
    });
};

exports.login = function (req,res){
    console.log(req.body);
    User.findOneAndUpdate({
        $or: [
            {$and: [ {email:req.body.email},{password:req.body.password}] },
            {$and: [ {username:req.body.email},{password:req.body.password}] }
        ]
    },{ is_active : true },function(err,user){
        // console.log(user);
        //cambiar esto para produccion
        req.session.user_id = user._id;
        res.redirect("/app");
    });
};

exports.signout = function(req, res) {
    User.findByIdAndUpdate( req.session.user_id, {is_active: false} ,function(err,user){
        // console.log("logout");
        req.session.destroy();
        res.redirect("/");
    });
};
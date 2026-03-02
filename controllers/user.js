const User = require("../models/User.js");


module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res)=>{
    try{
        let {username,password,email} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        //for automatically login after signup
        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }
        req.flash("success", "Welcome to NestAway");
        res.redirect("/listings");
        })

    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}


module.exports.login = async(req, res)=>{
        req.flash("success","welcome to NestAway you are logged in!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","You are successfully loggedout !");
        res.redirect("/listings");
    })
}
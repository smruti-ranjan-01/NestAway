const express = require("express");
let app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

let port = 8080;
main().then((res)=>{
    console.log("connected to db")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/NestAway');
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



app.listen(port, () => {
  console.log(`server is listening to port ${port} 🔥`);
});

app.get("/",(req,res)=>{
    console.log("Response");
    res.send("RRRRrrrr")
})




const sessionOptions = {
  secret : "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000, //in mili seconds (7days)
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.get("/demoUser",async(req,res) =>{
  const fakeUser = new User({
    username:"donal_01",
    email:"donal01@gmail.com",
  })
  let registeredUser = await User.register(fakeUser,"poiuytre");
  res.send(registeredUser);
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


//if the requested route is not matching with any route
  // app.all("*", (req, res, next) => {
  //   next(new ExpressError(404, "Status Not Found"));
  // });

//error handling middle ware
app.use((err,req,res,next)=>{
  let {statusCode=500, message="Something went wrong!"} = err;
  res.status(statusCode).render("error.ejs" ,{message});
  // res.status(statusCode).send(message);
});


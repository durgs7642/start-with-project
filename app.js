if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const user = require("./models/user.js");
const searchRouter = require("./routes/search.js");
const filterRouter= require("./routes/filter.js");


const dbUrl = process.env.ATLASDB_URL;

main().then(()=> {
    console.log("connected to db");
}).catch(err=> {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter: 24 * 3600,
}) ;

store.on("error", () => {
console.log("ERROR in MONGO SESSION STORE ", err);
});

const sessionOptions = {
    store,
    secret :  process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};



// app.get("/", (req, res)=> {
//     res.send("hi , I am root"); 
// });

app.use(session(sessionOptions));
app.use(flash()); // --------->>> before routes

app.use(passport.initialize());
app.use(passport.session());    
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user || null;
  next();
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    console.log(res.locals.success);
    res.locals.currUser = req.user ;
    next(); 
});



// app.get("/demouser", async(req, res) => {
//    let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "delta-student",
//    });

//    let registeredUser = await User.register(fakeUser, "helloworld");             //------->> it will automatically save
//    res.send(registeredUser);
// });

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings" , listingRouter);    
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);
app.use("/", searchRouter);
app.use("/",filterRouter);

// app.get("/testListing",async (req, res)=> {
//    let sampListing = new Listing({
//     title : "My New Villa",
//     description : "By the beach",
//     location : "calangute, Goa",
//     country : "India",
//    });
//     await sampListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");  
// });

// app.all("*", (req, res, next) => { 
//       console.log("Catch-all triggered for URL:", req.url);
//    next(new ExpressError(404,"Page Not Found"));            // this is not working properly
// });


app.use((req, res, next) => { 
   next(new ExpressError(404, "Page Not Found"));
});
    
app.use((err, req, res, next)=> {
    let {statusCode = 500, message = "something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
    // res.send("something went wrong"); 
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

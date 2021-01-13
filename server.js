const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const path = require("path");

const postRouter = require("./routes/router");

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;


// conneting mongodb database
mongoose
    .connect(process.env.MongoDB_URI, {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
    })
    .then(() => {
        console.log("MongoDB connection established...");
    })
    .catch((err) => {
        console.log(err)
    })



// setting view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));

// embedding assets files
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));


const store = new MongoDBSession({
    uri: process.env.MongoDB_URI,
    collection: "MySessions",
});


// session middleware
app.use(
    session({
        secret: "key that will sign cookie",
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

const isAuth = (req, res, next) => {
    if (req.session.isAuth){
        next()
    } else {
        res.redirect('/login');
    }
}

app.get('/', (req, res) => {
    res.render("landing");
})

app.get('/login', (req, res) => {
    res.render("login");
})

app.get('/register', (req, res) => {
    res.render("register");
})

app.get('/dashbord', isAuth, (req, res) => {
    res.render("dashbord");
})

app.use('/post', postRouter);

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})
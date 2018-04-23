const express    = require('express')
const mongoose   = require('mongoose')
const session    = require('express-session')
const passport   = require('passport')
const LocalStrategy  = require('passport-local')
const methodOverride = require('method-override')
const User       = require('./models/user')
const morgan     = require('morgan')
const ejs        = require('ejs')
const routes     = require('./routes')
const app        = express()

mongoose.connect('mongodb://dynamitt:dyn@ds117935.mlab.com:17935/kata')

app.set("view engine", "ejs")

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(function(err, req, res, next) {
    console.log(err);
});
app.use(morgan('dev'))
app.use(methodOverride('_method'))

//Passport Setup

app.use(session({
    secret : 'dynamizzy',
    resave : false,
    saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
passport.use(new LocalStrategy(User.authenticate()))

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/', routes)


app.listen(4000, () => {
    console.log("App is running on port 4000")
})
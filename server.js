require("dotenv").config();
const express = require("express");
const passport = require("./config/passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const routes = require("./routes.js");
const controllers = require("./controllers/auth.js");
const flash = require("connect-flash");

const app = express();

connectDB();

app.use(
    session({
        secret: process.env.SESSION_SECRET || "defaultSecret",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set("view engine", "ejs");

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true,
    })
);

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

app.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("dashboard", { user: req.user });
});

app.use("/api", controllers);
app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
    const { username, email, password, confirmpassword } = req.body;

    if (!username || !email || !password || !confirmpassword) {
        return res
            .status(400)
            .render("register", { error: "All fields are required" });
    }
    if (password !== confirmpassword) {
        return res
            .status(400)
            .render("register", { error: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return res
                .status(409)
                .render("register", { error: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username.trim(),
            email: email.trim(),
            password: hashedPassword,
        });
        await newUser.save();

        return res.redirect("/login");
    } catch (err) {
        console.error("Error during registration:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post(
    "/login",
    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.error("Error during login:", err.message);
                return res.status(500).json({ error: "Internal server error" });
            }
            if (!user) {
                return res
                    .status(401)
                    .render("login", { error: info ? info.message : "Login failed" });
            }
            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    console.error("Error during session creation:", loginErr.message);
                    return res.status(500).json({ error: "Session creation failed" });
                }
                req.session.name = user.username;
                req.session.save();
                return res.redirect("/");
            });
        })(req, res, next);
    }
);

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error during logout:", err.message);
            return res.status(500).json({ error: "Logout failed" });
        }
        req.session.destroy((destroyErr) => {
            if (destroyErr) {
                console.error("Error clearing session:", destroyErr.message);
                return res.status(500).json({ error: "Error clearing session" });
            }
            res.redirect("/");
        });
    });
});

module.exports = router;

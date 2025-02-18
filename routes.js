const express = require("express"); 
const router = express.Router(); 

router.get("/", (req, res) => { 
	if (req.session.name) { 
		var name = req.session.name; 
		res.render("dashboard", { name: name }); 
	} 
	return res.render("dashboard", { name: null }); 
});

router.get("/login", (req, res) => { 
	if (req.session.name) { 
		res.redirect("/"); 
	} 
	return res.render("login", { error: null }); 
});

router.get("/register", (req, res) => { 
	if (req.session.name) { 
		res.redirect("/"); 
	} 
	return res.render("register", { error: null }); 
}); 

module.exports = router; 
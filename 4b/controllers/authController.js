const bcrypt = require("bcrypt");
const config = require("../config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const { tb_users } = require("../models");

const saltRounds = 10;
const sequelize = new Sequelize(config.development);

async function authRegister(req, res) {
	const { username, email, password, confirmPassword } = req.body;

	console.log("Password:", password);
	console.log("Repassword:", confirmPassword);

	if (password !== confirmPassword) {
		req.flash("error", "Password confirmation is incorrect.");
		res.redirect("/register");
	} else {
		try {
			const hashedPassword = await bcrypt.hash(password, saltRounds);
			const user = await tb_users.create({
				username,
				email,
				password: hashedPassword,
			});
			req.flash("success", "Registration successful.");
			res.redirect("/login");
		} catch (error) {
			console.error(error);
			req.flash("error", "Oops!, username or email already exist");
			res.redirect("/register");
		}
	}
}

function renderRegister(req, res) {
	const user = req.session.user || null;

	if (user) {
		res.redirect("/");
	} else {
		res.render("register");
	}
}

async function authLogin(req, res) {
	const { email, password } = req.body;

	// check if user exist
	const user = await tb_users.findOne({
		where: {
			email: email,
		},
	});

	if (!user) {
		req.flash("error", "Cannot find username or email.");
		return res.redirect("/login");
	}

	// check if password is correct
	const isValidated = await bcrypt.compare(password, user.password);

	if (!isValidated) {
		req.flash("error", "Password does not match.");
		return res.redirect("/login");
	}

	let loggedInUser = user.toJSON();

	delete loggedInUser.password;

	req.session.user = loggedInUser;

	req.flash("success", "Login successful.");
	res.redirect("/");
}

function renderLogin(req, res) {
	const user = req.session.user;

	if (user) {
		res.redirect("/");
	} else {
		res.render("login");
	}
}

function authLogout(req, res) {
	req.session.user = null;

	res.redirect("/login");
}

module.exports = {
	authLogin,
	renderLogin,
	authRegister,
	renderRegister,
	authLogout,
};

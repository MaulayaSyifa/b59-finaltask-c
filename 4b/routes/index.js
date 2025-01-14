const express = require("express");
const router = express.Router();
const config = require("../config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const { tb_users, tb_task, tb_collections } = require("../models");

const sequelize = new Sequelize(config.development);

router.get("/", async (req, res) => {
	let { user } = req.session;

	if (user) {
		res.redirect("/collection");
	} else {
		res.render("login");
	}
});

module.exports = router;

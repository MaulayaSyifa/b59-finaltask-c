const config = require("../config/config.json");
const { Sequelize, QueryTypes, where } = require("sequelize");
const { tb_users, tb_task, tb_collections } = require("../models");

const sequelize = new Sequelize(config.development);

async function renderCollection(req, res) {
	let { user } = req.session;

	if (!user) {
		return res.redirect("/login");
	}

	const collections = await tb_collections.findAll({
		include: {
			model: tb_users,
			as: "user",
			attributes: { exclude: ["password"] },
		},
		include: {
			model: tb_task,
			as: "tasks",
			attributes: ["status"],
		},
		where: {
			user_id: user.id,
		},
	});

	const collectionsWithStats = collections.map((collection) => {
		const tasks = collection.tasks || [];

		const totalTasks = tasks.length;
		const completedTasks = tasks.filter((task) => task.is_done === true).length;

		return {
			...collection.get({ plain: true }),
			taskStats: {
				completed: completedTasks,
				total: totalTasks,

				percentComplete: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
			},
		};
	});

	res.render("collection", { collections: collectionsWithStats, user });
}

function renderCollectionAdd(req, res) {
	let { user } = req.session;

	if (!user) {
		return res.redirect("/login");
	}

	res.render("collection-add", { user });
}

async function collectionAdd(req, res) {
	let { user } = req.session;
	const { name } = req.body;

	const result = await tb_collections.create({
		name,
		user_id: user.id,
	});

	console.log("Create collection result : ", result);

	res.redirect("/collection");
}

// todo

async function renderTask(req, res) {
	try {
		let { user } = req.session;
		if (!user) {
			return res.redirect("/login");
		}

		const collection_id = req.params.collection_id;
		console.log("Collection ID:", collection_id);

		if (!collection_id) {
			return res.status(400).render("error", {
				message: "Collection ID is required",
				user,
			});
		}

		const collection = await tb_collections.findOne({
			where: {
				id: collection_id,
				user_id: user.id,
			},
		});

		if (!collection) {
			return res.status(404).render("error", {
				message: "Collection not found",
				user,
			});
		}

		const tasks = await tb_task.findAll({
			where: {
				collections_id: collection_id,
			},
			order: [["createdAt", "DESC"]],
		});

		const totalRows = await tb_task.count({
			where: {
				collections_id: collection_id,
			},
		});

		const completedTasks = tasks.filter(
			(task) => task.status === "checked" || task.status === "completed"
		).length;

		console.log("Rendering with data:", {
			collection_id,
			collectionName: collection.name,
			tasksCount: tasks.length,
		});

		res.render("task", {
			user,
			tasks,
			totalRows,
			collection,
			taskStats: {
				completed: completedTasks,
				total: totalRows,
			},
		});
	} catch (error) {
		console.error("Error in renderTask:", error);
		res.status(500).render("error", {
			message: "An unexpected error occurred",
			user: req.session.user,
		});
	}
}

async function taskUpdate(req, res) {}

async function taskAdd(req, res) {
	const { taskName } = req.body;
	const { collection_id } = req.params;

	const result = await tb_task.create({
		name: taskName,
		collections_id: collection_id,
	});

	console.log("Create task result : ", result);

	res.redirect(`/collection/${collection_id}/task`);
}

async function collectionDelete(req, res) {
	const { collection_id } = req.params;

	const result = await tb_collections.destroy({
		where: {
			id: collection_id,
		},
	});

	console.log("Query delete result :", result);

	res.redirect("/collection");
}

module.exports = {
	renderCollection,
	renderCollectionAdd,
	collectionAdd,
	renderTask,
	taskUpdate,
	taskAdd,
	collectionDelete,
};

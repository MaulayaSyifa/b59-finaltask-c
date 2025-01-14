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
		// order: [["createdAt", "DESC"]],
	});

	const collectionsWithStats = collections.map((collection) => {
		const totalTasks = collection.tasks.length;
		const completedTasks = collection.tasks.filter(
			(task) => task.status === "checked" || task.status === "completed"
		).length;

		return {
			...collection.get({ plain: true }),
			taskStats: {
				completed: completedTasks,
				total: totalTasks,
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
		// Get user from session
		let { user } = req.session;
		if (!user) {
			return res.redirect("/login");
		}

		// Get collection_id from URL parameters
		const collection_id = req.params.collection_id;
		console.log("Collection ID:", collection_id); // Debug log

		// Validate collection_id
		if (!collection_id) {
			return res.status(400).render("error", {
				message: "Collection ID is required",
				user,
			});
		}

		// First, fetch the collection details
		const collection = await tb_collections.findOne({
			where: {
				id: collection_id,
				user_id: user.id,
			},
		});

		// Make sure collection exists
		if (!collection) {
			return res.status(404).render("error", {
				message: "Collection not found",
				user,
			});
		}

		// Fetch tasks for this collection
		const tasks = await tb_task.findAll({
			where: {
				collections_id: collection_id,
			},
			order: [["createdAt", "DESC"]],
		});

		// Count total tasks
		const totalRows = await tb_task.count({
			where: {
				collections_id: collection_id,
			},
		});

		// Count completed tasks
		const completedTasks = tasks.filter(
			(task) => task.status === "checked" || task.status === "completed"
		).length;

		// Log what we're passing to the template (for debugging)
		console.log("Rendering with data:", {
			collection_id,
			collectionName: collection.name,
			tasksCount: tasks.length,
		});

		// Render template with all necessary data
		res.render("task", {
			user,
			tasks,
			totalRows,
			collection_id, // Explicitly pass the ID
			collection, // Pass the whole collection object
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

async function taskUpdate(req, res) {
	try {
		// Verify user authentication
		let { user } = req.session;
		if (!user) {
			return res.redirect("/login");
		}

		const { collection_id } = req.params;
		const { tasks } = req.body;

		// Fetch all tasks for this collection with security check
		const collectionTasks = await tb_task.findAll({
			where: {
				collections_id: collection_id,
			},
			include: {
				model: tb_collections,
				as: "collection",
				where: { user_id: user.id },
			},
		});

		// Process updates for each task
		const updatePromises = collectionTasks.map((task) => {
			// Convert checkbox state to your string status values
			// If the task ID exists in the submitted form data, it was checked
			const isChecked = Boolean(tasks[task.id]);

			// Set both status and is_done based on checkbox state
			const updates = {
				status: isChecked ? "checked" : "unchecked",
				is_done: isChecked ? "true" : "false", // Using strings since your column is string type
			};

			// Return the update promise
			return tb_task.update(updates, {
				where: {
					id: task.id,
					collections_id: collection_id,
				},
			});
		});

		// Wait for all updates to complete
		await Promise.all(updatePromises);

		// Add a success message and redirect
		req.flash("success", "Tasks updated successfully");
		res.redirect(`/collection/${collection_id}/task`);
	} catch (error) {
		console.error("Error updating tasks:", error);
		req.flash("error", "Failed to update tasks");
		const { collection_id } = req.params;
		res.redirect(`/collection/${collection_id}/task`);
	}
}

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
	const { id } = req.params;

	const result = await tb_collections.destroy({
		where: {
			id,
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

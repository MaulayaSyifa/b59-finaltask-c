const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

const config = require("../config/config.json");
const { Sequelize, QueryTypes, where } = require("sequelize");
const { tb_users, tb_task, tb_collections } = require("../models");

router.get("/collection", itemController.renderCollection);

router.get("/collection-add", itemController.renderCollectionAdd);
router.post("/", itemController.collectionAdd);

router.get("/collection/:collection_id/task", itemController.renderTask);
router.post("/collection/:collection_id/task", itemController.taskAdd);

router.post("/collection/:collection_id/task-add", itemController.taskUpdate);
router.post("/collection/:collection_id/task-delete", itemController.collectionDelete);

// router.post("/collection/:collection_id/update-tasks", itemController.taskUpdate);
// router.delete("/collection-delete/:id", itemController.deleteCollection);

module.exports = router;

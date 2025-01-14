const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get("/collection", itemController.renderCollection);

router.get("/collection-add", itemController.renderCollectionAdd);
router.post("/", itemController.collectionAdd);

router.get("/collection/:collection_id/task", itemController.renderTask);
router.post("/collection/:collection_id/task", itemController.taskAdd);
router.post("/collection/:collection_id/update-tasks", itemController.taskUpdate);
// router.patch("/collection/:collection_id", itemController.taskUpdate);

// router.delete("/collection-delete/:id", itemController.deleteCollection);

module.exports = router;

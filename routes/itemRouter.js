const express = require("express")
const router = express.Router()
const itemController = require("../controllers/itemController")

router.get("/", itemController.list);
router.get("/new", itemController.newGet);
router.post("/new", itemController.newPost);
router.get("/:id", itemController.detail);
router.get("/:id/edit", itemController.editPost);
router.get("/:id/delete", itemController.deleteGet);
router.post("/:id/delete", itemController.deletePost);
module.exports = router;
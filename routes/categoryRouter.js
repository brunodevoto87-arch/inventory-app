const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.list);
router.get("/new", categoryController.newGet);
router.post("/new", categoryController.newPost);
router.get("/:id", categoryController.detail);
router.get("/:id/edit", categoryController.editGet);
router.post("/:id/edit", categoryController.editPost);
router.get("/:id/delete", categoryController.deleteGet);
router.post("/:id/delete", categoryController.deletePost);

module.exports = router;
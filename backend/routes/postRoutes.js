const express = require("express")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const router = express.Router()
const postController = require("../controllers/post")

//ACCESS POINTS
router.get("/", auth, postController.getAllPosts)
router.get("/:id", auth, postController.getOnePost)
router.post("/", auth, multer, postController.createPost)
router.post("/:id/react", auth,postController.reactPost)
router.post("/:id/comment", auth, multer,postController.createComment)
router.delete("/:id", auth, postController.deletePost)

module.exports=router
const express = require("express")
const router = express.Router()
const userController = require("../controllers/user");

//ACCESS POINTS
router.post("/signup", userController.signup)
router.post("/login", userController.login)
router.delete("/delete", userController.delete)
router.get("/:id", userController.profile)
router.put("/:id", userController.modify)
router.get("/role", userController.role)

module.exports=router
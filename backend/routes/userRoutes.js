const express = require("express")
const router = express.Router()
const userController = require("../controllers/user");

//ACCESS POINTS FOLLOWING TO API SPECIFICATION FOR THIS PROJECT 
router.post("/signup", userController.signup)
router.post("/login", userController.login)
router.delete("/delete", userController.delete)
router.get("/:id/profile", userController.profile)
router.post("/modify", userController.modify)
router.get("/role", userController.role)

module.exports=router
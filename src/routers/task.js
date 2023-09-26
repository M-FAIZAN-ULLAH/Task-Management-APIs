const express = require("express")
const router = new express.Router()
const auth = require("../middleware/auth")

const {GetTask, GetTaskbyId, CreateTask, UpdateTask, DeleteTask} = require("../controllers/task")


router.route("/task").get(auth,GetTask).post(auth,CreateTask)
router.route("/task/:id").get(auth,GetTaskbyId).patch(auth,UpdateTask).delete(auth,DeleteTask)


 module.exports = router
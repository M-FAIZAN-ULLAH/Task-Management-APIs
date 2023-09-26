const Task = require("../models/task")

const CreateTask = async (req,res) => {
    // const task = new Task(req.body)
    const task = new Task ({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.send(e)
    }
}

// get /task?completed=true
// get /task?limit=1&skip=5
// get /task?sortBy=createdAt:desc
const GetTask = async (req,res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === "true"
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    }

    try{
        // const task = await Task.find({owner: req.user._id})
        await req.user.populate({
            path : "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    }catch(e){
        res.send(e)
    }
}

const GetTaskbyId = async (req,res) => {
    const _id = req.params.id

    try{
        const task = await Task.findById(_id, {owner: req.user._id})
        res.send(task)
    }catch(e){
        res.send(e)
    }
 }

 const UpdateTask = async (req,res) => {

    const update = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidOperation = update.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.send({error: "inValid Update!"})
    }

    try{

        const task  = await Task.findById(req.params.id, {owner: req.user._id})

        update.forEach((update) => task[update] = req.body[update])

        await task.save()


        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        if(!task){
            return res.send("Error while updating!")
        }
        res.send(task)

    }catch(e) {
        res.send(e)
    }
 }

 const DeleteTask =  async (req,res) => {
    try{
        const task = await Task.findOneAndDelete({ _id:req.params.id, owner: req.user._id})
        if(!task){
            return res.send({error: "Error on deleting!"})
        }
        res.send(task)
    }catch(e){
        res.send(e)
    }
 }



module.exports = {
    CreateTask,
    GetTask,
    GetTaskbyId,
    UpdateTask,
    DeleteTask
}
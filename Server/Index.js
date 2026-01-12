import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'

const app = express();
app.use(cors())

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    }
});

const url = "mongodb://127.0.0.1:27017/ToDo-Db";
const Task = mongoose.model("Task", taskSchema);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const conn = async () => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
    }
};

conn()
app.post("/add", async (req, res) => {
    try {
        const newTask = new Task(
            {
                task: req.body.task
            }
        )
        const response = await newTask.save();

        res.send(response);

    }
    catch (e) {

        res.status(500).json({
            msg: e.message
        })
    }
})


app.delete("/delete/:id", async (req, res) => {
    let id = req.params.id;
    let response = await Task.findByIdAndDelete(id);
    if (!response) {
        return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
})

app.patch("/update/:id", async (req, res) => {
    try {

        let id = req.params.id;
        let { task } = req.body;

        if (!task) {
            return res.status(400).json({ message: "Task is required" })
        }
        let updatedTask = await Task.findByIdAndUpdate(
            id,
            { task: task },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(400).json({ message: "Task Not Found" })
        }
        res.status(200).json({
            message: "Task updated successfully",
            data: updatedTask
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }


})



app.get("/", async (req, res) => {
    let result = await Task.find();
    res.json(result)
})

app.listen(3200)


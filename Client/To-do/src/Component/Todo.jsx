import React, { useState, useEffect } from 'react';
import axios from 'axios'
function Todo() {
    const [myValue, setMyValue] = useState("");
    const [task, setTask] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [])

    const fetchTasks = async () => {
        const response = await axios.get("http://localhost:3200/");
        setTask(response.data);
    }
    const AddTask = async () => {
        if (myValue.trim() === "") return;
        try {
            if (editIndex) {
                await axios.patch(`http://localhost:3200/update/${editIndex}`, {
                    task: myValue
                });
                console.log("data Updated");

                fetchTasks();
                setEditIndex(null);
                setMyValue("");


            }
            else {
                const response = await axios.post("http://localhost:3200/add", {
                    task: myValue
                })
                setMyValue("");
                fetchTasks();
            }
        }
        catch (error) {
            console.log("Data Not inserted", error)
        }
    };


    const deleteElement = async (idx) => {
        try {
            let response = await axios.delete(`http://localhost:3200/delete/${idx}`)
            console.log("Data Deleted");
            fetchTasks();
        }
        catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="container">
            <h1>Add Task</h1>

            <form
                className="todo-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    AddTask();
                }}
            >
                <input
                    type="text"
                    value={myValue}
                    onChange={(e) => setMyValue(e.target.value)}
                    placeholder="Enter Task"
                    name='task'
                />
                <button type="submit"> {editIndex ? 'Update' : 'Add'} </button>
            </form>

            <div className="task-list">
                {task.length === 0 ? (
                    <p className="no-task">No Task Added</p>
                ) : (
                    task.map((item) => (
                        <div className="task-item" key={item._id}>
                            <span className="task-text">{item.task}</span>
                            <div className="btn">

                                <button className='del' onClick={(e) => {
                                    deleteElement(item._id);
                                }} >Delete</button>
                                <button className='up' onClick={() => {
                                    setMyValue(item.task)
                                    setEditIndex(item._id)
                                }}>Update</button>
                            </div>
                        </div>
                    ))
                )}
            </div>


        </div>
    );
}

export default Todo;

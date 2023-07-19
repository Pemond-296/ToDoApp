import React, { useEffect, useState } from "react"
import styled from "styled-components"
import {
    Container, Grid,
    IconButton, ListItem,
    ListItemText, List, Typography
} from "@mui/material"

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import { ActionToDo } from "./ActionToDo"

type task = {
    name: string;
    priority: number;
    start: string;
    end: string;
    id: number;
    completed: boolean;
}

export const ToDo: React.FC = () => {
    const [secondary, setSecondary] = useState(false);
    const [tasks, setTask] = useState<task[]>(() => {
        const storage = JSON.parse(localStorage.getItem('todo') || "[]");
        return storage
    })

    const handleDone = (id: number) => {
        setTask((prevTasks: task[]) => {
            const index = prevTasks.findIndex((todo) => todo.id === id);
            if (index !== -1) {
                const newTasks = [...prevTasks];
                newTasks[index].completed = true;
                const jsonTasks = JSON.stringify(newTasks);
                localStorage.setItem("todo", jsonTasks);
                return newTasks;
            }
            return prevTasks;
        });
    };

    const handleDelete = (id: number) => {
        setTask((prevTasks: task[]) => {
            const index = prevTasks.findIndex((todo) => todo.id === id);
            if (index !== -1) {
                const newTasks = [...prevTasks];
                newTasks.splice(index, 1);
                const jsonTasks = JSON.stringify(newTasks);
                localStorage.setItem("todo", jsonTasks);
                return newTasks;
            }
            return prevTasks;
        })
    }

    // Option to use Action
    const add = 1;
    const edit = 2;
    const [action, setAction] = useState<number>(0)

    const [showAddToDo, setShowAddToDo] = useState(false);
    const handleAdd = () => {
        setAction(add)
        setShowAddToDo(true)
        setShowEditToDo(false)
    }
    const updateTasks = (newTask: task) => {
        setTask((prevTasks: task[]) => {
            const updatedTasks = [...prevTasks, newTask];
            updatedTasks.sort((a, b) => (a.priority >= b.priority) ? 1 : -1)
            const jsonTasks = JSON.stringify(updatedTasks);
            localStorage.setItem("todo", jsonTasks);
            return updatedTasks;
        });
        setShowAddToDo(false)
    };

    //Edit Logic
    const [showEditToDo, setShowEditToDo] = useState(false)
    const [editData, setEditDaTa] = useState<task>()
    const handleEdit = (todo: task) => {
        setAction(edit)
        setEditDaTa(todo)
        setShowEditToDo(true)
        setShowAddToDo(false)
    }
    const updateToDo = (todo: task) => {
        setTask((prevTasks: task[]) => {
            const index = prevTasks.findIndex((task) => task.id === todo.id)
            prevTasks[index] = todo
            const updatedTasks = [...prevTasks]
            updatedTasks.sort((a, b) => (a.priority >= b.priority) ? 1 : -1)
            const jsonTasks = JSON.stringify(updatedTasks);
            localStorage.setItem("todo", jsonTasks);
            return updatedTasks;
        })
        setShowEditToDo(false)
    }
    const handleCancel = () => {
        setShowEditToDo(false);
    }

    return (
        <ContainerCSS>
            {showEditToDo &&
            <div className="edit_screen">
                <ActionToDo
                    updateTasks={updateTasks}
                    dataToDo={editData as task & { id: number; completed: boolean }}
                    updateToDo={updateToDo}
                    onCancel = {handleCancel}
                    action = {action}
                />
            </div>
            }
            <Container className={showEditToDo ? "blur" : ""}>
                <Grid item xs={12} md={6}>
                    <Typography
                        sx={{ mt: 4, mb: 2 }}
                        variant="h4"
                        component="div"
                        classes="padding"
                    >
                        Todo App
                    </Typography>
                    <List
                        classes="list-group"
                    >
                        {tasks?.map((todo: task, index: number) => (
                            <>
                                <ListItem
                                    key={index}
                                    className={`list-todo`}
                                    secondaryAction={
                                        <div className="action">
                                            <IconButton
                                                className={`edit-${todo.completed ? 'completed' : ''}`}
                                                onClick={() => handleEdit(todo)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDelete(todo.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    }
                                >
                                    <button
                                        className={`task_checkbox ${todo.completed ? 'completed' : ''}`}
                                        id={`priority-${todo.priority}`}
                                        onClick={() => handleDone(todo.id)}>
                                        <svg width="10" height="16"></svg>
                                    </button>
                                    <ListItemText
                                        className={`main_content ${todo.completed ? 'completed' : ''}`}
                                        primary={todo.name}
                                        secondary={!secondary ? (
                                            <Typography
                                                variant="body2"
                                                sx={{ ml: 0, fontSize: '12px', opacity: 0.6 }}
                                            >
                                                {todo.start} - {todo.end}
                                            </Typography>
                                        ) : null}
                                    />
                                </ListItem>
                            </>
                        ))}
                    </List>
                </Grid>
            </Container>
            <hr />
            {!showAddToDo ? (
                <li className="add_task" onClick={() => handleAdd()}>
                    <button >
                        <span className="icon_add">
                            <svg width="24" height="20">
                                <path d="M6 6V.5a.5.5 0 011 0V6h5.5a.5.5 0 110 1H7v5.5a.5.5 0 11-1 0V7H.5a.5.5 0 010-1H6z" fill="currentColor" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                        <p>Add task</p>
                    </button>
                </li>
            ) : (
                <ActionToDo 
                    updateTasks={updateTasks} 
                    dataToDo={editData as task & { id: number; completed: boolean }}
                    updateToDo={updateToDo}
                    onCancel = {handleCancel}
                    action = {action}
                />
            )}

        </ContainerCSS>
    )
}

const ContainerCSS = styled(Container)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .blur{
        filter: blur(5px);
        pointer-events: none;
    }
    .task_checkbox{
        background-color: white;
        border-radius: 50%;
        margin-top: -14px;
        margin-right: 1rem;
        position: relative;
        border: none;
        &:hover{
            cursor: pointer;
            transform: scale(1.05)
        }
    }
    .completed{
        text-decoration: line-through;
        color: gray;
        pointer-events: none;
    }
    .edit-completed{
        display: none;
    }

    hr{
        opacity: 0.3;
    }
    .action{
        display: none;
    }
    .list-todo:hover .action{
        display: block;
    }
    .main_content{
        pointer-events: none
    }
    #priority-1{
        border: 3px solid red;
    }
    #priority-2{
        border: 3px solid orange;
    }
    #priority-3{
        border: 3px solid blue;
    }
    #priority-4{
        border: 3px solid black;
    }
    .add_task{
        list-style: none;
        margin-left: 20px;
        button{
            border: none;
            background-color: white;
            display: flex;
            padding: 5px 20px;
            margin-top: 10px;
            margin-left: 5px;
            &:hover{
                color: red;
                cursor: pointer;
                transform: scale(1.1);
                border-radius: 16px;
            }
            p{
                margin-top: 0px;
            }
        }
    }
    .edit_screen{
        background-color: #f7fbfc;
        z-index: 999;
        display: flex;
        position: absolute;
        top: 30%;
        left: 19%;
        border: 2px solid #b2bec3;
        padding: 30px 0px;
        border-radius: 16px;
        box-shadow: #636e72 2px 0px 12px 0px;
        z-index: 999;
    }
    @media(max-width: 767px) {
        .edit_screen{
            left: 4%;
        }
    }
    @media(max-width: 1217px) {
        .edit_screen{
            left: 3%;
        }
    }
`

import React, { useEffect, useState } from "react"
import styled from "styled-components"
import {
    Container, Grid,
    IconButton, ListItem,
    ListItemText, List, Typography
} from "@mui/material"

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import { AddToDo } from "./AddToDo"
import { EditToDo } from "./EditToDo"

export const ToDo: React.FC = () => {
    const [secondary, setSecondary] = useState(false);
    const [tasks, setTask] = useState<any>(() => {
        const storage = JSON.parse(localStorage.getItem('todo') || "[]");
        return storage
    })

    const handleDone = (id: number) => {
        setTask((prevTasks: any[]) => {
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
        setTask((prevTasks: any[]) => {
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

    const [showAddToDo, setShowAddToDo] = useState(false);
    const updateTasks = (newTask: any) => {
        setTask((prevTasks: any[]) => {
            const updatedTasks = [...prevTasks, newTask];
            updatedTasks.sort((a, b) => (a.priority >= b.priority) ? 1 : -1)
            const jsonTasks = JSON.stringify(updatedTasks);
            localStorage.setItem("todo", jsonTasks);
            return updatedTasks;
        });
        setShowAddToDo(false)
    };

    const [showEditToDo, setShowEditToDo] = useState(false)
    const [editData, setEditDaTa] = useState<any>()
    const handleEdit = (todo: any) => {
        setEditDaTa(todo)
        setShowEditToDo(true)
    }
    const updateToDo = (todo: any) => {
        setTask((prevTasks: any[]) => {
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
                <EditToDo
                    dataToDo={editData}
                    updateToDo={updateToDo}
                    onCancel = {handleCancel}
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
                        Todo Application
                    </Typography>
                    <List
                        classes="list-group"
                    >
                        {tasks?.map((todo: any, index: number) => (
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
                <li className="add_task" onClick={() => setShowAddToDo(true)}>
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
                <AddToDo updateTasks={updateTasks} />
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
        border: 3px solid orangered;
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
        z-index: 999;
        display: block;
        position: absolute;
        top: 30%;
        left: 20%;
    }
`

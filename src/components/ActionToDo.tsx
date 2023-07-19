import React from "react"
import styled from "styled-components"

import {
    FormControl, Container, TextField,
    Button, Grid, MenuItem, Select, InputLabel, IconButton
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { DemoItem } from '@mui/x-date-pickers/internals/demo';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { z, ZodType } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { format } from "date-fns"

type task = {
    name: string;
    priority: number;
    start: string;
    end: string;
}

export const ActionToDo: React.FC<
    {
        updateTasks: (newTask: task & { id: number; completed: boolean }) => void,
        dataToDo: task & { id: number; completed: boolean }, updateToDo: (todo: task & { id: number; completed: boolean }) => void, onCancel: Function,
        action: number
    }
> = ({ updateTasks,
    dataToDo, updateToDo, onCancel,
    action
}) => {
        const schema: ZodType<task> = z
            .object({
                name: z.string()
                    .min(5, "TaskName should be at least 5 characters")
                    .max(50, "TaskName should be up to 50 characters"),
                priority: z.number({
                    required_error: "Priority is required"
                }),
                start: z.string().min(1, "Start is required"),
                end: z.string()
            })
            .refine((data) => data.start < data.end, {
                message: "StartTime can not later than EndTime",
                path: ['end']
            });

        const {
            register,
            handleSubmit,
            setValue,
            getValues,
            formState: { errors }
        } = useForm<task>({
            resolver: zodResolver(schema),
            defaultValues: {
                ...(action === 2 && {
                    name: dataToDo.name,
                    start: dataToDo.start,
                    end: dataToDo.end,
                    priority: dataToDo.priority
                })
            }
        })

        const handleData = (data: task) => {
            console.log(data);
            const item = {
                ...data,
                id: Math.floor(Math.random() * 100),
                completed: false
            }
            updateTasks(item)
        }

        //Edit Task Here
        const handleCancel = () => {
                onCancel();
        }

        const handleUpdate = (data: task) => {
            const updatedToDo = {
                ...dataToDo,
                start: data.start,
                end: data.end,
                priority: data.priority,
                name: data.name
            }
            updateToDo(updatedToDo)
        }
        console.log(getValues())

        return (
            <ContainerCSS>
                {action === 2 &&
                    <IconButton
                        className="close_edit"
                        onClick={() => handleCancel()}
                    >
                        <CloseIcon />
                    </IconButton>}
                <Container
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <FormControl
                        style={{ width: "25rem" }}
                    >
                        <TextField
                            required
                            label="Task Name"
                            variant="standard"
                            {...register("name")}
                            onChange={(e) => {
                                setValue("name", e.target.value)
                            }}
                        />
                        {errors.name && <span>{errors.name.message}</span>}
                        <div style={{ marginTop: "10px" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={1}>
                                    <Grid item xs={4.1}>
                                        <DemoItem>
                                            <TimePicker
                                                label= {getValues("start") || "StartTime"}
                                                {...register("start")}
                                                onChange={(date: Date | null) => {
                                                    date && setValue('start', String(format(new Date(date), 'HH:mm')))
                                                }}
                                            />
                                        </DemoItem>
                                        {errors.start && <span>{errors.start.message}</span>}
                                    </Grid>
                                    <Grid item xs={4.1}>
                                        <DemoItem>
                                            <TimePicker
                                                label= {getValues("end") || "EndTime"}
                                                {...register("end")}
                                                onChange={(date: Date | null) => {
                                                    date && setValue('end', String(format(new Date(date), 'HH:mm')))
                                                }}
                                            />
                                        </DemoItem>
                                    </Grid>

                                    <Grid item xs={3.8}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Priority {getValues('priority')} </InputLabel>
                                                    <Select {...register("priority")}>
                                                        <MenuItem value={1} onClick={() => {
                                                            setValue('priority', 1)
                                                        }}>Priority 1</MenuItem>
                                                        <MenuItem value={2} onClick={() => {
                                                            setValue('priority', 2)
                                                        }}>Priority 2</MenuItem>
                                                        <MenuItem value={3} onClick={() => {
                                                            setValue('priority', 3)
                                                        }}>Priority 3</MenuItem>
                                                        <MenuItem value={4} onClick={() => {
                                                            setValue('priority', 4)
                                                        }}>Priority 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        {errors.priority && <span>{errors.priority.message}</span>}
                                    </Grid>
                                    {errors.end && <span style={{ marginLeft: "4rem" }}>{errors.end.message}</span>}
                                </Grid>

                            </LocalizationProvider>
                        </div>

                        {action !== 2 ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                                style={{ width: "150px", margin: "auto", marginTop: "10px" }}
                                onClick={handleSubmit(handleData)}
                            >
                                Add Task
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                                style={{ width: "150px", margin: "auto", marginTop: "10px" }}
                                onClick={handleSubmit(handleUpdate)}
                            >
                                Update
                            </Button>
                        )
                        }
                    </FormControl>
                </Container>
            </ContainerCSS>
        )
    }

const ContainerCSS = styled(Container)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .close_edit{
        position: absolute;
        right: 10px;
        top: -30px;
    }
    span{
        color: red;
    }
`
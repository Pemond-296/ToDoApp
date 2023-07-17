import React from "react"
import styled from "styled-components"

import { FormControl, Container, TextField,
         Button, Grid, MenuItem, Select, InputLabel } from "@mui/material"
import { DemoItem } from '@mui/x-date-pickers/internals/demo';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { z, ZodType } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

type task = {
    content: string;
    priority: number;
    start: string;
    end: string;
}

export const AddToDo: React.FC<{ updateTasks: (newTask: any) => void }> = ({updateTasks}) => {

    const compareTimes = (time1: string, time2: string) => {
        const t1 = new Date(time1)
        const t2 = new Date(time2)
        const tmp1 = t1.getTime()
        const tmp2 = t2.getTime()
        return tmp2 > tmp1
    };

    const schema: ZodType<task> = z
        .object({
            content: z.string()
                .min(5, "TaskName should be at least 5 characters")
                .max(50, "TaskName should be up to 50 characters"),
            priority: z.number({
                required_error: "Priority is required"
            }),
            start: z.string(),
            end: z.string()
        })
        .refine((data) => compareTimes(data.start, data.end), {
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
        resolver: zodResolver(schema)
    })

    const handleData = () => {
        const item = {
            id: Math.floor(Math.random() * 100),
            name: getValues("content"),
            priority: getValues("priority"),
            start: getValues("start").slice(16, 21),
            end: getValues("end").slice(16, 21),
            completed: false
        }
        updateTasks(item)
    }

    return (
        <ContainerCSS>
            <Container
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <form onSubmit={handleSubmit(handleData)}>
                    <FormControl
                        style={{ width: "25rem" }}
                    >
                        <TextField
                            required
                            label="Task Name"
                            variant="standard"
                            {...register("content")}
                            onChange={(e) => {
                                setValue("content", e.target.value)
                            }}
                        />
                        {errors.content && <span>{errors.content.message}</span>}
                        <div style={{ marginTop: "10px" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={1}>
                                    <Grid item xs={4.1}>
                                        <DemoItem>
                                        <TimePicker
                                                label="StartTime"
                                                {...register("start")}
                                                onChange={(e:any) => {
                                                    setValue('start', String(e.$d))
                                                }}
                                            />
                                        </DemoItem>
                                    </Grid>
                                    <Grid item xs={4.1}>
                                        <DemoItem>
                                            <TimePicker
                                                label="EndTime"
                                                {...register("end")}
                                                onChange={(e:any) => {
                                                    setValue('end', String(e.$d))
                                                }}
                                            />
                                        </DemoItem>
                                    </Grid>

                                    <Grid item xs={3.8}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Priority </InputLabel>
                                                    <Select {...register("priority")}>
                                                        <MenuItem value={1} onClick={() => {
                                                            setValue('priority', 1)
                                                        }}>Priority 1</MenuItem>
                                                        <MenuItem value={2} onClick={() =>{
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
                                    {errors.end && <span style={{marginLeft: "4rem"}}>{errors.end.message}</span>}                      
                                </Grid>

                            </LocalizationProvider>
                        </div>

                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            style={{ width: "150px", margin: "auto", marginTop: "10px" }}
                        >
                            Add Task
                        </Button>
                    </FormControl>
                </form>
            </Container>
        </ContainerCSS>
    )
}

const ContainerCSS = styled(Container)`
    display: flex;
    justify-content: center;
    align-items: center;
    span{
        color: red;
    }
`
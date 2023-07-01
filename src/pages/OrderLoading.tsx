import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { Typography, Stack } from "@mui/material";

export interface IOrderLoadingProps {}

export function OrderLoading(props: IOrderLoadingProps): JSX.Element
{
    return (
    <Stack alignItems={"center"} spacing={2}>
        <CircularProgress />
        <br></br>
        <Typography>One moment...</Typography>
    </Stack>)
}

import React from "react";
import { Product } from "../models";
import CheckCircle from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import Launch from '@mui/icons-material/Launch';
import { Typography, Stack, styled, Paper  } from "@mui/material";

export interface IPostPurchaseProps {
    suggestedProducts?: Product[];
}

export function PostPurchase(props: IPostPurchaseProps): JSX.Element
{
    return (
    <Stack spacing={2} alignItems={"center"}>
        <Typography variant="h3">Thank you</Typography>
        <Typography>Your order will be shipped to you shortly.</Typography>
        <br/>
        <CheckCircle color="success" fontSize="large" />
        <br/>
        <Typography>Here are some other items you also might like:</Typography>
        <br/>
        {
            props.suggestedProducts === undefined  && <CircularProgress />
        }
        {
           props.suggestedProducts && 
           <Stack spacing={2}>
                {
                    props.suggestedProducts.map(p =>
                        <SuggestedBook key={p.id} elevation={4} square>
                            <Stack>
                                <Typography>{p.name}</Typography>
                                <Typography>${p.price}</Typography>
                            </Stack>
                            <Launch color="success" />
                        </SuggestedBook>
                    )
                }
         </Stack>
        }
    </Stack>)
}

const SuggestedBook = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    border: theme.spacing(2),
    justifyContent: "space-between",
    display: 'flex',
    flexDirection: "row",
    gap: '20px'
  }));
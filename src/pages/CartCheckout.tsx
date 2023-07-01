import React, { useMemo } from "react";
import { Product } from "../models";
import Button from '@mui/material/Button';
import { List, Typography, ListItem, Divider, ListItemText, Stack  } from "@mui/material";

export interface ICartCheckoutProps {
    products: Product[];
    onConfirmClicked: () => void;
}

export function CartCheckout(props: ICartCheckoutProps): JSX.Element
{
    const totalPrice = useMemo(() => props.products.reduce((p, c) => p + c.price, 0), []);

    return (
    <Stack spacing={2}>
        <Typography variant="h3">Review your cart</Typography>
        <br/>
        <List>
            {props.products.map(p => 
                <>
                <ListItem  key={p.id} secondaryAction={"$" + p.price}>
                    <ListItemText 
                        primary={p.name}
                        secondary={p.author}
                    />
                </ListItem >
                <Divider />
                </>
            )}
            <ListItem secondaryAction={"$" + totalPrice}>
                <ListItemText primary="Total:"/>
            </ListItem >
            <Divider />
        </List>
        <br />
        <Button variant="contained" color="success" onClick={props.onConfirmClicked}>Pay Now</Button>
    </Stack>)
}
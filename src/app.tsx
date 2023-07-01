
import React, { useMemo } from "react";
import { StoreActionTypes, StoreEventTypes, StoreStateTypes, storeMachine } from "./machines/store";
import { useMachine } from '@xstate/react';
import { CartCheckout } from "./pages/CartCheckout";
import { OrderLoading } from "./pages/OrderLoading";
import { PostPurchase } from "./pages/PostPurchase";

export function App(props: {preload?: boolean}): JSX.Element 
{
    // When preloading is turned off we stub out the preload hint action.
    const preloadActionOverride = useMemo(() => (Boolean(props.preload) 
        ? {} 
        : {[StoreActionTypes.SendPreloadHint]: () => {} })
    , [props.preload]);

    const [state, send] = useMachine(storeMachine.withConfig({ actions: {...preloadActionOverride}}));

    return (
        <div style={{width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
            {
                state.matches(StoreStateTypes.CartCheckout) && 
                <CartCheckout products={state.context.cartProducts} onConfirmClicked={() => send({ type: StoreEventTypes.Confirm})} />
            }
            {
                state.matches(StoreStateTypes.OrderLoading) &&
                <OrderLoading />
            }
            {
                state.matches(StoreStateTypes.PostPurchase) &&
                <PostPurchase suggestedProducts={state.context.suggestedProducts} />
            }
        </div>
    )
}
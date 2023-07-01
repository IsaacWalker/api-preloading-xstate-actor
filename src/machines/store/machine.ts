import { assign, createMachine, send, sendTo, spawn } from "xstate"
import { StoreActionTypes, StoreContext, StoreEventTypes, StoreStateTypes } from "./types"
import { Product } from "../../models"
import { SuggestionsEventTypes, SuggestionsParentEventTypes, suggestionsMachine } from "../suggestions";

const testProducts: Product[] = [
    {
        name: "Modelling Reactive Systems",
        author: "David Harel",
        price: 39.99,
        id: "439a6fb1-b89c-4365-b79b-571c3de41a37"
    },
    {
        name: "Modelling Software Behaviour",
        author: "Paul Jorgensen",
        price: 29.99,
        id: "00137477-e4a8-4676-bd59-1b8e8ed5b365"
    },
    {
        name: "Software Architecture in Practice",
        author: "Bass, Clements, Kazman",
        price: 59.99,
        id: "0c26f179-6b38-45a5-a0bb-ef9c028ac1fc"
    }
]

const testOrderId = "6b944023-f197-477e-b069-0886f4141d14";

const storeMachine = createMachine<StoreContext>({
    initial: StoreStateTypes.CartCheckout,
    context: {
        cartProducts: testProducts,
        orderId: testOrderId
    },
    predictableActionArguments: true,
    states: 
    {
        [StoreStateTypes.CartCheckout]: {
            on: {
                [StoreEventTypes.Confirm]: {
                    target: StoreStateTypes.OrderLoading
                }
            },
        },

        /**
         * When we start loading the order call we do two actions
         * in quick succession for suggestion preloading:
         * 
         * 1. Spawn the suggestions machine with the ids for the ordered product.
         * 2. Instruct the spawned machine to preload the suggestions.
         */
        [StoreStateTypes.OrderLoading]: {
            invoke: {
                id: "createOrder",
                src: (context) => createOrder(context.orderId),
                onDone: {
                  target: StoreStateTypes.PostPurchase
                },
            },
            entry: [
                assign({
                    suggestionsActorRef: context => spawn(suggestionsMachine
                        .withContext({ inputProductIds: context.cartProducts.map(p => p.id) }))
                }),
                StoreActionTypes.SendPreloadHint
            ]
        },
        /**
         * When the order has completed we load the suggestions (expect a reply from the actor).
         * 
         * At this stage the suggestions should already be fully or partially preloaded so perceived load time should be snappy.
         */
        [StoreStateTypes.PostPurchase]: {
            entry: [
                sendTo(context => context.suggestionsActorRef, { type: SuggestionsEventTypes.LoadSuggestions })
            ],
            on: {
                [SuggestionsParentEventTypes.SuggestionsLoaded]: {
                    actions: [
                        assign({
                            suggestedProducts: (context, event) => event.items
                        }),
                    ]
                }
            }
        }
    }
}, {
    actions: {
        [StoreActionTypes.SendPreloadHint]: sendTo(context => context.suggestionsActorRef, { type: SuggestionsEventTypes.PreloadSuggestions })
    }
})

async function createOrder(orderId: string): Promise<void>
{
    const body = JSON.stringify({ orderId });

    await fetch("api/order", { method: "POST", body })
}

export { storeMachine }
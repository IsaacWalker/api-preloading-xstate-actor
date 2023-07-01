import { ActorRef } from "xstate";
import { Product } from "../../models"

const enum StoreStateTypes {
    CartCheckout = "cartCheckout",
    OrderLoading = "orderLoading",
    PostPurchase = "postPurchase"
}

const enum StoreEventTypes {
    Confirm = "confirm"
}

const enum StoreActionTypes {
    SpawnSuggestionsAction = "spawnSuggestionsActor",
    SendPreloadHint = "sendPreloadHint"
}

type StoreContext = {
    cartProducts: Product[];
    orderId: string;
    suggestionsActorRef?: ActorRef<any>;
    suggestedProducts?: Product[];
}

export {
    StoreStateTypes,
    StoreEventTypes,
    StoreActionTypes,
    StoreContext
}
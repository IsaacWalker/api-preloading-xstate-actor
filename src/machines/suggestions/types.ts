import { Product } from "../../models"

const enum SuggestionsStateTypes {
    Idle = "idle",
    Loading = "loading",
    Silent = "silent",
    Notify = "notify",
    Loaded = "loaded"
}

const enum SuggestionsEventTypes {
    PreloadSuggestions = "preloadSuggestions",
    LoadSuggestions = "loadSuggestions",
    GetSuggestionsSucceed = "done.invoke.getSuggestions"
}

const enum SuggestionsParentEventTypes {
    SuggestionsLoaded = "suggestionsLoaded"
}

type SuggestionsContext = {
    inputProductIds: string[];
    suggestedProducts?: Product[];
}

const enum SuggestionsActionTypes {
    SendSuggestionsToParent = "sendSuggestionsToParent"
}

export {
    SuggestionsStateTypes,
    SuggestionsEventTypes,
    SuggestionsParentEventTypes,
    SuggestionsContext,
    SuggestionsActionTypes
}
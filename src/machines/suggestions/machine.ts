import { assign, createMachine } from "xstate";
import { SuggestionsActionTypes, SuggestionsContext, SuggestionsEventTypes, SuggestionsParentEventTypes, SuggestionsStateTypes } from "./types";
import { Product } from "../../models";
import { sendParent } from "xstate/lib/actions";

/**
 * This machine is responsible for loading a single request for suggestions (Suggested books based on the ordered books).
 * 
 * It is initialized with the ordered books in the context.
 * 
 * It handles two external events:
 * 1. PreloadSuggestions: Start preloading suggestions if not started already.
 * 2. LoadSuggestions: Load suggestions if not started already - this will include informing the parent when complete.
 * 
 * A single spawned instance represents a single preloadable request.
 * This means that subsequent preloadSuggestions events won't have any effect and
 * Multple LoadSuggestions events will result in the same response being sent to the parent instantly.
 */
export const suggestionsMachine = createMachine<SuggestionsContext>({
    id: "suggestions",
    initial: SuggestionsStateTypes.Idle,
    predictableActionArguments: true,
    states: {
        [SuggestionsStateTypes.Idle]: {
            on: {
                [SuggestionsEventTypes.PreloadSuggestions]: {
                    target: `${[SuggestionsStateTypes.Loading]}.${[SuggestionsStateTypes.Silent]}`,
                },
                [SuggestionsEventTypes.LoadSuggestions]: {
                    target: `${[SuggestionsStateTypes.Loading]}.${[SuggestionsStateTypes.Notify]}`,
                },
            },
        },

        /**
         * Entering the Loading state kicks off the request to retrieve suggestions.
         * Within this state there are two modes - both of which assign the suggestions
         * to the context and transition to Loaded when the request succeeds.
         * 
         * Silent does not inform the parent machine.
         * If the Parent requests that the suggestions be loaded then it transfers to Notify.
         * 
         * Notify does inform the parent machine.
         * 
         */
        [SuggestionsStateTypes.Loading]: {
            invoke: {
                id: "getSuggestions",
                src: (context) => getSuggestions(context.inputProductIds)
            },
            states: {
                [SuggestionsStateTypes.Silent]: {
                    on: {
                        [SuggestionsEventTypes.LoadSuggestions]: {
                            target:  SuggestionsStateTypes.Notify,
                            internal: true
                        },
                        [SuggestionsEventTypes.GetSuggestionsSucceed]: {
                            target: `#suggestions.${SuggestionsStateTypes.Loaded}`,
                            actions: [
                                assign({
                                    suggestedProducts: (context, event) => event.data
                                }),
                            ]
                        }
                    }
                },
                [SuggestionsStateTypes.Notify]: {
                    on: {
                        [SuggestionsEventTypes.GetSuggestionsSucceed]: {
                            target: `#suggestions.${SuggestionsStateTypes.Loaded}`,
                            actions: [
                                assign({
                                    suggestedProducts: (context, event) => event.data,
                                }),
                                SuggestionsActionTypes.SendSuggestionsToParent
                            ]
                        }
                    }
                }
            }
        },

        /**
         * When the suggestions are loaded we can immediately send them to the parent 
         * whenever they are requested.
         */
        [SuggestionsStateTypes.Loaded]: {
            on: {
                [SuggestionsEventTypes.LoadSuggestions]: {
                    actions: [SuggestionsActionTypes.SendSuggestionsToParent]
                }
            }
        }
    }
}, {
    actions: {
        [SuggestionsActionTypes.SendSuggestionsToParent]: sendParent(
            context => ({ type: SuggestionsParentEventTypes.SuggestionsLoaded, items: context.suggestedProducts })) 
    }
})

async function getSuggestions(productIds: string[]): Promise<Product[]>
{
    const queryString = new URLSearchParams(
        productIds.map(v => ["productId", v]))
        .toString();

    const suggestedProducts = await fetch("api/suggestions?" + queryString, {  })
        .then(r => r.json());

    return suggestedProducts as Product[];
}
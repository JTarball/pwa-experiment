import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import { persistCache } from "apollo3-cache-persist";
import { setContext } from "@apollo/client/link/context";

import { myState } from "../store/state.js";

const cache = new InMemoryCache({
    addTypename: false,
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = myState.jwt_token;
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const link = new HttpLink({
    uri: "http://localhost:4001/feapi",
});

export let client;

//export const localStorage = window.localStorage;

export async function getClient() {
    console.debug("getClient");
    if (client) return client;

    // Wait for the cache to be restored
    await persistCache({ cache, storage: localStorage });

    // Create the Apollo Client
    client = new ApolloClient({ cache: cache, link: authLink.concat(link) });

    return client;
}

export async function refreshClient() {
    console.debug("refreshClient", client);

    await client.clearStore();

    // // Wait for the cache to be restored
    // await persistCache({ cache, storage: localStorage });

    // const updateAuthLink = setContext((_, { headers }) => {
    //     // get the authentication token from local storage if it exists
    //     const token = myState.jwt_token;

    //     console.log("token", token);

    //     // return the headers to the context so httpLink can read them
    //     return {
    //         headers: {
    //             ...headers,
    //             authorization: token ? `Bearer ${token}` : "",
    //         },
    //     };
    // });

    // // Create the Apollo Client
    // client = new ApolloClient({ cache: cache, link: updateAuthLink.concat(link) });

    window.__APOLLO_CLIENT__ = client;
}

(async function init() {
    window.__APOLLO_CLIENT__ = await getClient();
})();

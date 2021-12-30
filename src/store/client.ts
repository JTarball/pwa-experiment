import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import { persistCache } from "apollo3-cache-persist";

const cache = new InMemoryCache();

const link = new HttpLink({
    uri: "http://localhost:8000/feapi",
});

let client;

//export const localStorage = window.localStorage;

export async function getClient() {
    if (client) return client;

    // Wait for the cache to be restored
    await persistCache({ cache, storage: localStorage });

    // Create the Apollo Client
    client = new ApolloClient({ cache, link });

    return client;
}

document.querySelector("apollo-client").client = getClient();

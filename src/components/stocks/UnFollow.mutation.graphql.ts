import { gql } from "@apollo/client/core";

export const UnFollow = gql`
    mutation UnFollow($symbol: String) {
        unfollow_stock(symbol: $symbol) {
            trace_id
        }
    }
`;

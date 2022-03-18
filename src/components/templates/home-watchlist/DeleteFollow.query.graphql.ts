import { gql } from "@apollo/client/core";

export const DeleteFollow = gql`
    mutation DeleteFollow($symbol: String) {
        unfollow_stock(symbol: $symbol) {
            trace_id
        }
    }
`;

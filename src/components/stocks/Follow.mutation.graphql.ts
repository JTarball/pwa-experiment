import { gql } from "@apollo/client/core";

export const Follow = gql`
    mutation AddFollow($symbol: String) {
        follow_stock(symbol: $symbol) {
            trace_id
        }
    }
`;

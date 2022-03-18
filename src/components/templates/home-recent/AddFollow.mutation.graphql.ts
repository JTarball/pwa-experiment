import { gql } from "@apollo/client/core";

export const AddFollow = gql`
    mutation AddFollow($symbol: String) {
        follow_stock(symbol: $symbol) {
            trace_id
        }
    }
`;

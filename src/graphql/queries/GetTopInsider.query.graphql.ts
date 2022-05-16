import { gql } from "@apollo/client/core";

export const GetTopInsider = gql`
    query GetTopInsider($symbol: String!) {
        top_insider(symbol: $symbol, period: LAST18MONTHS) {
            insider_name
            position
            no_of_transactions
            net_change_value
            net_change_shares
            buys
            sells
        }
    }
`;

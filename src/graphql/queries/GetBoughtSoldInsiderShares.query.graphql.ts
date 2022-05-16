import { gql } from "@apollo/client/core";

export const GetBoughtSoldInsiderShares = gql`
    query GetBoughtSoldInsiderShares($symbol: String!) {
        bought_sold_insider(symbol: $symbol) {
            last_1m {
                buys_shares
                sells_shares
            }
            last_3m {
                buys_shares
                sells_shares
            }
            last_6m {
                buys_shares
                sells_shares
            }
            last_12m {
                buys_shares
                sells_shares
            }
            last_18m {
                buys_shares
                sells_shares
            }
        }
    }
`;

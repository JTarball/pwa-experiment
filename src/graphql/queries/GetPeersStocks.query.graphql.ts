import { gql } from "@apollo/client/core";

export const GetPeersStocks = gql`
    query GetPeersStocks($symbols: [String]) {
        stocks(symbols: $symbols) {
            items {
                symbol
                company_name
                logo_url
                description
                country
                market_cap
                price
            }
            total_results
        }
    }
`;
